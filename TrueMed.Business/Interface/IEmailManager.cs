using System.Net.Mail;

namespace TrueMed.Business.Interface
{
    public interface IEmailManager
    {
        Task SendEmailAsync(List<string> toEmails, string subject, string body, List<string>? cc = null, List<string>? bcc = null, List<Attachment>? attachments = null);
        bool IsValidEmail(string email);
    }
}
