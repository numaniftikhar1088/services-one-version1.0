namespace TrueMed.Services.UserManagement.Models.Account.Response
{
    public class TokenResponse
    {
        public string Token { get; set; }
        public string Username { get; set; }
        public int ExpiresIn { get; set; }
        public DateTime? Expires { get; set; }
        public List<AuthTenant> AuthTenants { get; set; } = new();
    }
    public class AuthTenant
    {
        public string Key { get; set; }
        public string Name { get; set; }
        public string URL { get; set; }
        public string Logo { get; set; }
        public bool isReferenceLab { get; set; }
    }
}
