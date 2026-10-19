import os
import smtplib
from email.message import EmailMessage

def send_email(to_email: str, subject: str, text: str, html: str = None):
    host = os.getenv("SMTP_HOST", "smtp.gmail.com")
    port = int(os.getenv("SMTP_PORT", "587"))
    user = os.getenv("SMTP_USER")
    password = os.getenv("SMTP_PASSWORD")

    if not user or not password:
        print(f"[DEV] Email to {to_email}\nSubject: {subject}\n{text}")
        return

    msg = EmailMessage()
    msg["Subject"] = subject 
    msg["From"] = f"NSTI Cakes <{user}>"  
    msg["To"] = to_email  
    msg.set_content(text)  
    if html:
        msg.add_alternative(html, subtype="html")

    try:
        with smtplib.SMTP(host, port) as server:
            server.starttls()
            server.login(user, password)
            server.send_message(msg)
    except Exception as e:
        print(f"[EMAIL ERROR] {e}")