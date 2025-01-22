using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using MVC.ClientApp.Models;
using MVC.ClientApp.shared;
using System.Collections.ObjectModel;

namespace MVC.ClientApp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ApiClientController : ControllerBase
    {
        private readonly MVCClientAppContext _appContext;

        public ApiClientController(MVCClientAppContext appContext)
        {
            _appContext = appContext;
        }

        [HttpGet]
        public IActionResult GetAll()
        {
            var clients = _appContext.Clients.ToList();

            return Ok(ResponseModel<List<Client>>.SuccessResponse(clients));
        }

        [HttpGet("{id:int}")]
        public IActionResult Get(int id)
        {
            var client = _appContext.Clients.FirstOrDefault(x => x.Id == id);
            if (client == null)
            {
                return BadRequest(ResponseModel<Client>.ErrorResponse());
            }

            var clientData = new Client
            {
                Id = id,
                Name = client.Name,
                Email = client.Email,
                Phone = client.Phone,
            };

            return Ok(ResponseModel<Client>.SuccessResponse(clientData));
        }

        [HttpPost]
        public IActionResult CreateClient([FromBody] Client client)
        {
            if (client == null)
            {
                return BadRequest(ResponseModel<string>.ErrorResponse());
            }

            _appContext.Clients.Add(client);
            _appContext.SaveChanges();

            return Ok(ResponseModel<Client>.SuccessResponse(client));
        }

        [HttpPut("{id:int}")]
        public IActionResult UpdateClient(int id, [FromBody] Client client)
        {
            if (client == null || client.Id != id)
            {
                return Ok(ResponseModel<Client>.ErrorResponse());
            }

            var existingClient = _appContext.Clients.FirstOrDefault(x =>x.Id == id);
            if (existingClient == null)
            {
                return NotFound();
            }

            existingClient.Name = client.Name;
            existingClient.Email = client.Email;
            existingClient.Phone = client.Phone;

            _appContext.Clients.Update(existingClient);
            _appContext.SaveChanges();

            return Ok(ResponseModel<Client>.SuccessResponse(existingClient));
        }

        [HttpDelete("{id:int}")]
        public IActionResult DeleteClient(int id)
        {
            var client = _appContext.Clients.FirstOrDefault(x => x.Id == id);
            if (client == null) return BadRequest(ResponseModel<Client>.ErrorResponse());

            _appContext.Clients.Remove(client);
            _appContext.SaveChanges();

            return Ok((ResponseModel<int>.SuccessResponse(id)));
        }
    }
}
