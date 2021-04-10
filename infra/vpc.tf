locals {
  # Methodology from https://aws.amazon.com/blogs/startups/practical-vpc-design/
  #
  # First two bits of prefix are AZ, with 11 = Spare
  # Next bits:
  #   0 = Private /19
  #   10 = Public /20
  #   11 = Spare /20

  availability_zones = toset(["us-east-2a", "us-east-2b"])

  availability_zone_cidr_blocks = {
    for index, name in sort(data.aws_availability_zones.this.names) :
    name => cidrsubnet(aws_vpc.this.cidr_block, 2, index) # Two bits for AZ /18
  }
}

data "aws_availability_zones" "this" {}

resource "aws_vpc" "this" {
  cidr_block = "10.0.0.0/16"

  tags = {
    Name = "cdsandbox"
  }
}

resource "aws_subnet" "private" {
  for_each = local.availability_zones

  vpc_id            = aws_vpc.this.id
  availability_zone = each.key
  cidr_block        = cidrsubnet(local.availability_zone_cidr_blocks[each.key], 1, 0) # xx0 /19

  tags = {
    Name       = "cdsandbox-private-${each.key}"
    SubnetType = "private"
  }
}

resource "aws_subnet" "public" {
  for_each = local.availability_zones

  vpc_id                  = aws_vpc.this.id
  availability_zone       = each.key
  cidr_block              = cidrsubnet(local.availability_zone_cidr_blocks[each.key], 2, 2) # xx10 /20
  map_public_ip_on_launch = true

  tags = {
    Name       = "cdsandbox-public-${each.key}"
    SubnetType = "public"
  }
}

resource "aws_internet_gateway" "this" {
  vpc_id = aws_vpc.this.id

  tags = {
    Name = "cdsandbox"
  }
}

resource "aws_route_table" "public" {
  vpc_id = aws_vpc.this.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.this.id
  }
}

resource "aws_route_table_association" "public" {
  for_each = local.availability_zones

  subnet_id      = aws_subnet.public[each.key].id
  route_table_id = aws_route_table.public.id
}

resource "aws_security_group" "web_server" {
  name        = "webserver"
  description = "Web server behind load balancer"
  vpc_id      = aws_vpc.this.id
}

resource "aws_security_group_rule" "web_server_ingress_from_lb" {
  security_group_id        = aws_security_group.web_server.id
  type                     = "ingress"
  protocol                 = "tcp"
  from_port                = 80
  to_port                  = 80
  source_security_group_id = aws_security_group.load_balancer.id
}

resource "aws_security_group_rule" "web_server_egress_all" {
  security_group_id = aws_security_group.web_server.id
  type              = "egress"
  protocol          = "all"
  from_port         = 0
  to_port           = 0
  cidr_blocks       = ["0.0.0.0/0"]
  ipv6_cidr_blocks  = ["::/0"]
}

resource "aws_security_group" "load_balancer" {
  name        = "loadbalancer"
  description = "Internet-facing load balancer"
  vpc_id      = aws_vpc.this.id
}

resource "aws_security_group_rule" "load_balancer_ingress_internet_http" {
  security_group_id = aws_security_group.load_balancer.id
  type              = "ingress"
  protocol          = "tcp"
  from_port         = 80
  to_port           = 80
  cidr_blocks       = ["0.0.0.0/0"]
  ipv6_cidr_blocks  = ["::/0"]
}

resource "aws_security_group_rule" "load_balancer_ingress_internet_https" {
  security_group_id = aws_security_group.load_balancer.id
  type              = "ingress"
  protocol          = "tcp"
  from_port         = 443
  to_port           = 443
  cidr_blocks       = ["0.0.0.0/0"]
  ipv6_cidr_blocks  = ["::/0"]
}

resource "aws_security_group_rule" "load_balancer_egress_to_web_server" {
  security_group_id        = aws_security_group.load_balancer.id
  type                     = "egress"
  protocol                 = "tcp"
  from_port                = 80
  to_port                  = 80
  source_security_group_id = aws_security_group.web_server.id
}
