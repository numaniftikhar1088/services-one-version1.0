using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;
using System.Threading.Tasks;

namespace TrueMed.Domain.Helpers
{
    public class X_Portal_Key_EXCEPTION : Exception
    {
        public X_Portal_Key_EXCEPTION()
        {
        }

        public X_Portal_Key_EXCEPTION(string? message) : base(message)
        {
        }

        public X_Portal_Key_EXCEPTION(string? message, Exception? innerException) : base(message, innerException)
        {
        }

        protected X_Portal_Key_EXCEPTION(SerializationInfo info, StreamingContext context) : base(info, context)
        {
        }
    }
}
