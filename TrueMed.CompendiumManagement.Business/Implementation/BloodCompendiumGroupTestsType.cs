using AutoMapper;
using Microsoft.AspNet.Identity;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using TrueMed.Business.Interface;
using TrueMed.CompendiumManagement.Business.Interface;
using TrueMed.CompendiumManagement.Domain.Models.Dtos.Request;
using TrueMed.CompendiumManagement.Domain.Models.ResponseModel;
using TrueMed.Domain.Databases;
using TrueMed.Business.TenantDbContext;
using TrueMed.Domain.Models.Database_Sets.Application;
namespace TrueMed.CompendiumManagement.Business.Implementation
{
    public class BloodCompendiumGroupTestsType : IBloodCompendiumGroupTestsType
    {
        private readonly IConnectionManager _connectionManager;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly IMapper _mapper;
        private readonly IDapperManager _dapperManager;
        private ApplicationDbContext _dbContext;

        public BloodCompendiumGroupTestsType(IConnectionManager connectionManager, IDapperManager dapperManager, IHttpContextAccessor httpContextAccessor, IMapper mapper)
        {
            _connectionManager = connectionManager;
            _httpContextAccessor = httpContextAccessor;
            _mapper = mapper;
            _dapperManager = dapperManager;
            LoggedInUser = httpContextAccessor.HttpContext.User.Identity.GetUserId();
            _dbContext = ApplicationDbContext.Create(connectionManager) ?? throw new ArgumentNullException();
        }
        public string LoggedInUser { get; set; }

        public async Task<RequestResponse> GetAllAsync()
        {
            var response = new RequestResponse();
            var query = "SELECT * FROM tblCompendiumPanels";
            var queryResult = await _dapperManager.QueryAsync<TblCompendiumPanel>(query);
            //var queryResult = await _dbContext.Connection.QueryAsync(query);
            response.Data = queryResult;

            return response;
        }

        public async Task<RequestResponse> SaveAsync(SaveGroupTestsTypeRequest request)
        {
            var response = new RequestResponse();

            _dbContext.ChangeTracker.QueryTrackingBehavior = QueryTrackingBehavior.NoTracking;
            var entity = _mapper.Map<SaveGroupTestsTypeRequest, TblCompendiumPanel>(request);

            using (var transaction = _dbContext.Database.BeginTransaction())
            {
                try
                {
                    if (entity.Id > 0)
                    {
                        var getEntryForEdit = await _dbContext.TblCompendiumPanels.FindAsync(entity.Id);
                        if (getEntryForEdit != null)
                        {
                            entity.UpdatedDate = DateTimeNow.Get;
                            entity.UpdatedBy = LoggedInUser;
                            entity.CreatedDate = getEntryForEdit.CreatedDate;
                            entity.CreatedBy = getEntryForEdit.CreatedBy;

                            var recordFromPanelAssignment = await _dbContext.TblCompendiumPanelAssignments.FirstOrDefaultAsync(f => f.ParentPanelId == getEntryForEdit.Id);
                            if (recordFromPanelAssignment != null)
                            {
                                recordFromPanelAssignment.PanelDisplayName = entity.PanelName;
                                recordFromPanelAssignment.UpdatedDate = DateTimeNow.Get;
                                recordFromPanelAssignment.UpdatedBy = LoggedInUser;

                                _dbContext.TblCompendiumPanelAssignments.Update(recordFromPanelAssignment);
                            }
                            _dbContext.TblCompendiumPanels.Update(entity);
                            response.Message = "Record Updated...";
                        }
                        else
                        {
                            response.Message = "Record is not exist against ID : {entity.Id}";
                        }
                    }
                    else
                    {
                        entity.CreatedDate = DateTimeNow.Get;
                        entity.CreatedBy = LoggedInUser;

                        await _dbContext.TblCompendiumPanels.AddAsync(entity);
                        await _dbContext.SaveChangesAsync();

                        var panelId = entity.Id;

                        var tblPanelAssignment = new TblCompendiumPanelAssignment()
                        {
                            ParentPanelId = panelId,
                            ChildPanelId = panelId,
                            PanelDisplayName = entity.PanelName.ToUpper(),
                            //IsGroupTest = false,
                            SortOrder = 1,
                            IsActive = true,
                            IsDeleted = false,
                            CreatedBy = LoggedInUser,
                            CreatedDate = DateTimeNow.Get
                        };
                        await _dbContext.TblCompendiumPanelAssignments.AddAsync(tblPanelAssignment);
                        response.Message = "Record Saved...";
                    }
                    await _dbContext.SaveChangesAsync();
                    transaction.Commit();
                }
                catch (Exception)
                {
                    response.Message = "InternalServerError";
                    transaction.Rollback();
                }
            }
            return response;
        }
    }
}
