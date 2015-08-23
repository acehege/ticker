import paramiko

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(
    paramiko.AutoAddPolicy())
ssh.connect('127.0.0.1', username='acehege', password='ww2')
ssh_stdin, ssh_stdout, ssh_stderr = ssh.exec_command('touch /tmp/nodejs_says_hello')
print 'test'