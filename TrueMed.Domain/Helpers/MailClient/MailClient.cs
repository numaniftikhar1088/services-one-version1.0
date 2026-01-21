using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Mail;
using System.Net.Mime;
using System.Text;
using System.Threading.Tasks;

namespace TrueMed.Domain.Helpers.MailClient
{
    public class MailClient : IMailClient
    {
        private string _fromEmail;
        public string FromEmail => _fromEmail;
        SmtpClient _smtpClient;
        readonly MailSettings _mailSettings;
        bool _isSentMail;
        bool IMailClient.IsSentMail => _isSentMail;
        AlternateView _alternateView;
        MailMessage _mailMessage;
        IList<LinkedResource> _linkedResources;
        public MailClient(MailSettings mailSettings)
        {
            _mailSettings = mailSettings;
            _smtpClient = new SmtpClient();
            _smtpClient.Host = _mailSettings.HostName;
            _smtpClient.Port = _mailSettings.Port;
            _smtpClient.DeliveryMethod = SmtpDeliveryMethod.Network;
            _smtpClient.EnableSsl = false;
            _smtpClient.UseDefaultCredentials = false;
            _smtpClient.Credentials = new NetworkCredential(_mailSettings.Username, _mailSettings.Password);
            this._fromEmail = _mailSettings.Username;
            _mailMessage = new MailMessage();
            _linkedResources = new List<LinkedResource>();
        }
        bool IMailClient.Send(string subject, string toEmail, string message)
        {
            return Send(subject, toEmail, "", message);
        }

        public void Dispose()
        {
            _smtpClient.Dispose();
            _smtpClient = null;
        }
        public bool Send(string subject, string toEmail, string fromEmail, string message)
        {
            if (string.IsNullOrWhiteSpace(fromEmail))
            {
                _mailMessage.From = new MailAddress(this.FromEmail);
            }
            else
                _mailMessage.From = new MailAddress(fromEmail);
            _mailMessage.To.Add(new MailAddress(toEmail));
            _mailMessage.Subject = subject;
            _mailMessage.IsBodyHtml = true;
            _alternateView = AlternateView.CreateAlternateViewFromString(message, null, MediaTypeNames.Text.Html);
            foreach (var resource in _linkedResources)
            {
                _alternateView.LinkedResources.Add(resource);
            }
            _mailMessage.AlternateViews.Add(_alternateView);
            _fromEmail = _mailMessage.From.Address;
            try
            {
                _smtpClient.Send(_mailMessage);
                _isSentMail = true;
            }
            catch (Exception)
            {
                _isSentMail = false;
            }
            return _isSentMail;
        }

        public void AddResource(LinkedResource linkedResource)
        {
            _linkedResources.Add(linkedResource);
        }
    }
}
