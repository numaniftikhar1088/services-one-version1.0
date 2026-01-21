using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Mail;
using System.Text;
using System.Threading.Tasks;

namespace TrueMed.Business.Services.Common.Interface
{
    public interface IEmailService
    {
        Task<bool> SendEmailAsync(string from, string to, string? subject, string? body, string host, int port, string username, string? password);
        Task<bool> SendEmailAsync(string from, string to, string subject, string body, string cc, string bcc);
        Task<bool> SendEmailAsync(string from, string to, string subject, string body, List<Attachment> attachments);
        Task<bool> SendEmailAsync(string from, string to, string subject, string body, string cc, string bcc, List<Attachment> attachments);
    }
}
