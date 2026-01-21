using System.Net;
using System.Net.Mail;
using System.Text.RegularExpressions;
using TrueMed.Business.Interface;
using TrueMed.Domain.Helpers;

namespace TrueMed.Business.Implementation
{
    public class EmailManager : IEmailManager
    {
        private readonly SmtpClient _smtpClient;

        public EmailManager(SmtpClient smtpClient)
        {
            _smtpClient = smtpClient;
        }

        public async Task SendEmailAsync(List<string> toEmails, string subject, string body, List<string>? cc = null, List<string>? bcc = null, List<Attachment>? attachments = null)
        {
            try
            {
                if (toEmails.Any())
                {
                    #region SMTP Settings
                    _smtpClient.Host = ConfigurationKeys.Email.HOST ?? "";
                    _smtpClient.Port = ConfigurationKeys.Email.PORT;
                    _smtpClient.UseDefaultCredentials = false;
                    _smtpClient.Credentials = new NetworkCredential(ConfigurationKeys.Email.USERNAME, ConfigurationKeys.Email.PASSWORD);
                    _smtpClient.EnableSsl = ConfigurationKeys.Email.USE_SSL;
                    _smtpClient.DeliveryMethod = SmtpDeliveryMethod.Network;
                    #endregion
                    #region MailMessage Setup
                    var mailMessage = new MailMessage();
                    mailMessage.From = new MailAddress(ConfigurationKeys.Email.FROM_ADDRESS ?? "", ConfigurationKeys.Email.FROM_NAME);

                    foreach (var toEmail in toEmails)
                    {
                        mailMessage.To.Add(new MailAddress(toEmail));
                    }
                    mailMessage.Subject = subject;
                    mailMessage.Body = body;
                    mailMessage.IsBodyHtml = true;

                    if (cc != null)
                    {
                        foreach (var emailCC in cc)
                        {
                            mailMessage.CC.Add(new MailAddress(emailCC));
                        }
                    }

                    if (bcc != null)
                    {
                        foreach (var emailBCC in bcc)
                        {
                            mailMessage.Bcc.Add(new MailAddress(emailBCC));
                        }
                    }

                    if (attachments != null)
                    {
                        foreach (var attachment in attachments)
                        {
                            mailMessage.Attachments.Add(attachment);
                        }
                    }
                    #endregion
                    await _smtpClient.SendMailAsync(mailMessage);
                    _smtpClient.Dispose();
                }
            }
            catch (Exception ex)
            {
                _smtpClient.Dispose();
                throw;
            }

        }
        public bool IsValidEmail(string email)
        {
            // Regular expression pattern for email validation
            string pattern = @"^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$";

            Regex regex = new Regex(pattern);

            return regex.IsMatch(email);
        }

    }
}
