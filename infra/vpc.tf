locals {
  # Methodology from https://aws.amazon.com/blogs/startups/practical-vpc-design/
  #
  # First two bits of prefix are AZ, with 11 = Spare
  # Next bits:
  #   0 = Private /19
  #   10 = Public /20
  #   11 = Spare /20

  availability_zone_cidr_blocks = {
    "us-east-2a" = cidrsubnet(aws_vpc.this.cidr_block, 2, 0) # 00*
    "us-east-2b" = cidrsubnet(aws_vpc.this.cidr_block, 2, 1) # 01*
    "us-east-2c" = cidrsubnet(aws_vpc.this.cidr_block, 2, 2) # 10*
  }
}

resource "aws_vpc" "this" {
  cidr_block = "10.0.0.0/16"

  tags = {
    Name = "cdsandbox-vpc"
  }
}

resource "aws_subnet" "private" {
  for_each = local.availability_zone_cidr_blocks

  vpc_id            = aws_vpc.this.id
  availability_zone = each.key
  cidr_block        = cidrsubnet(each.value, 1, 0) # xx0*

  tags = {
    Name       = "cdsandbox-private-${each.key}"
    SubnetType = "private"
  }
}

resource "aws_subnet" "public" {
  for_each = local.availability_zone_cidr_blocks

  vpc_id                  = aws_vpc.this.id
  availability_zone       = each.key
  cidr_block              = cidrsubnet(each.value, 2, 2) # xx10*
  map_public_ip_on_launch = true

  tags = {
    Name       = "cdsandbox-public-${each.key}"
    SubnetType = "public"
  }
}

resource "aws_security_group" "web_traffic" {
  name        = "web_traffic"
  description = "HTTP and HTTPS traffic"
  vpc_id      = aws_vpc.this.id

  ingress {
    protocol         = "tcp"
    from_port        = 80
    to_port          = 80
    cidr_blocks      = ["0.0.0.0/0"]
    ipv6_cidr_blocks = ["::/0"]
  }

  ingress {
    protocol         = "tcp"
    from_port        = 443
    to_port          = 443
    cidr_blocks      = ["0.0.0.0/0"]
    ipv6_cidr_blocks = ["::/0"]
  }
}
