using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Mail;
using System.Net;
using System.Text;
using System.Threading.Tasks;
using TrueMed.Business.Services.Common.Interface;

namespace TrueMed.Business.Services.Common.Implementation
{
    public class EmailService : IEmailService
    {
        public bool IsSend { get; set; }
        public async Task<bool> SendEmailAsync(string from, string to, string? subject, string? body, string host, int port,string username,string password)
        {
            SmtpClient _smtpClient = new SmtpClient();
            try
            {
                await Task.Run(() =>
                {

                    MailMessage mailMessage = new MailMessage(from, to, subject, body);
                    mailMessage.IsBodyHtml = true;
                    _smtpClient.Host = host;
                    _smtpClient.Port = port;
                    _smtpClient.UseDefaultCredentials = false;
                    _smtpClient.Credentials = new NetworkCredential(username, password);
                    _smtpClient.EnableSsl = true;
                    _smtpClient.Send(mailMessage);
                    IsSend = true;
                });
            }
            catch (SmtpException ex)
            {
                throw ex;
            }
            finally
            {
                _smtpClient.Dispose();
            }
            return IsSend;
        }
        public async Task<bool> SendEmailAsync(string from, string to, string subject, string body, string cc, string bcc)
        {
            MailMessage mailMessageobj = new MailMessage();
            return true;
        }
        public async Task<bool> SendEmailAsync(string from, string to, string subject, string body, List<Attachment> attachments)
        {
            MailMessage mailMessageobj = new MailMessage();
            return true;
        }
        public async Task<bool> SendEmailAsync(string from, string to, string subject, string body, string cc, string bcc, List<Attachment> attachments)
        {
            MailMessage mailMessageobj = new MailMessage();
            return true;
        }
    }
}
