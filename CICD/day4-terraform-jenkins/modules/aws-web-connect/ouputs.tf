output "security_vpc_id" {
  value = [aws_vpc.lap.id]
}
output "security_subnet_public_id" {
  value = [aws_subnet.public.id]
}
output "security_group_lap_id" {
  value = [aws_security_group.lap.id]
}

