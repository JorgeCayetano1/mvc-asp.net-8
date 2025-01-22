using System.Collections.ObjectModel;

namespace MVC.ClientApp.shared
{
    public class ResponseModel<T>
    {
        public int StatusCode { get; set; }
        public T? Data { get; set; }

        public static ResponseModel<T> SuccessResponse(T Data)
        {
            
            return new ResponseModel<T>
            {
                StatusCode = 200,
                Data = Data
            };
        }

        public static ResponseModel<T> ErrorResponse()
        {
            return new ResponseModel<T>
            {
                StatusCode = 400
            };
        }
    }
}
