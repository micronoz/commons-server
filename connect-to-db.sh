ssh -i secrets/my-key.pem -f -N -L 5433:commons-aurora-stack-dbcluster-1aou11us00k9b.cluster-ckjbjchdztcg.us-east-1.rds.amazonaws.com:5432 ec2-user@54.146.222.25 -v
psql -hlocalhost -Ucommons -p5433 -d commons
