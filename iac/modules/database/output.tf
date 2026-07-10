output "rds_endpoint" {
  description = "Endpoint DNS de la instancia RDS"
  value       = aws_db_instance.gestor_rsl_mysql.address
}

output "rds_port" {
  description = "Puerto de la instancia RDS"
  value       = aws_db_instance.gestor_rsl_mysql.port
}
