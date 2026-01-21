using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Mail;
using System.Text;
using System.Threading.Tasks;

namespace TrueMed.Domain.Helpers.MailClient
{
    public interface IMailClient: IDisposable
    {
        bool Send(string subject, string toEmail, string message);
        void AddResource(LinkedResource linkedResource);
        bool Send(string subject, string toEmail, string fromEmail, string message);
        bool IsSentMail
        {
            get;
        }
        string FromEmail
        {
            get;
        }

    }
}
