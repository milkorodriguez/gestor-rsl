output "load_balancer_url" {
  description = "DNS publico del ALB"
  value       = aws_lb.gestor_rsl_alb.dns_name
}
