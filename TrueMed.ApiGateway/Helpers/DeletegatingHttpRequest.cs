namespace TrueMed.ApiGateway.Helpers
{
    public class DeletegatingHttpRequest: DelegatingHandler
    {
        protected override Task<HttpResponseMessage> SendAsync(HttpRequestMessage request, CancellationToken cancellationToken)
        {
            return base.SendAsync(request, cancellationToken);
        }

    }
}
