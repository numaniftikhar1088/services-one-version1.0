using Microsoft.AspNetCore.Mvc.Filters;

namespace TrueMed.Domain.Helpers
{
    public class ActionFilterCustomAttribute : ActionFilterAttribute, IActionFilter
    {
        public override void OnActionExecuted(ActionExecutedContext context)
        {

        }

        public override void OnActionExecuting(ActionExecutingContext context)
        {

        }
    }
}