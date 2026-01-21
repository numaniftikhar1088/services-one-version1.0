using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TrueMed.Domain.Model.Logger;

namespace TrueMed.Domain.Repositories.Logging.Interface
{
    public interface IUserActivity
    {
       Task LogActivityAsync(UserActivityLogViewModel viewModel);
    }
}
