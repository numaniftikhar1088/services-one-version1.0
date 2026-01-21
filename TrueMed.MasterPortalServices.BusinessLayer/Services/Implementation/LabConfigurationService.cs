using AutoMapper;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Graph;
using System;
using System.Linq.Dynamic;
using TrueMed.Business.Interface;
using TrueMed.CompendiumManagement.Domain.Models.ResponseModel;
using TrueMed.Domain.Databases;
using TrueMed.Domain.Enums;
using TrueMed.Domain.Model.Identity;
using TrueMed.Business.Interface;
using TrueMed.MasterPortalAppManagement.Domain.Models.Configuration.Request;
using TrueMed.MasterPortalAppManagement.Domain.Models.Configuration.Response;
using TrueMed.MasterPortalAppManagement.Domain.Models.Dtos.Request;
using TrueMed.MasterPortalAppManagement.Domain.Models.Dtos.Response;
using TrueMed.MasterPortalServices.BusinessLayer.Services.Interface;
using TrueMed.Domain.Models.Database_Sets.Application;
using TrueMed.Sevices.MasterEntities;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory;
using Status = TrueMed.Domain.Model.Identity.Status;
using TrueMed.Business.MasterDBContext;
using TrueMed.Business.TenantDbContext;
using TrueMed.Domain.Models.LookUps.Common;

namespace TrueMed.MasterPortalServices.BusinessLayer.Services.Implementation
{
    public class LabConfigurationService : ILabConfigurationService
    {
        private MasterDbContext _dbContext;
        private ApplicationDbContext _applicationDbContext;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly IMapper _mapper;
        private readonly ILookupManager _lookupManager;


        public LabConfigurationService(MasterDbContext dbContext,
            ApplicationDbContext applicationDbContext,
            IHttpContextAccessor httpContextAccessor,
            IMapper mapper,
            ILookupManager lookupManager)
        {
            _dbContext = dbContext;
            _applicationDbContext = applicationDbContext;
            _httpContextAccessor = httpContextAccessor;
            _mapper = mapper;
            _lookupManager = lookupManager;
        }
        public List<SectionWithControls> GetSystemFieldConfigurations(int pageId)
        {
            var controls = new List<SectionWithControls>();

            var tblPageSectionInfos = _dbContext.TblPageSections.Where(f => f.PageId == pageId).ToList();
            foreach (var tblPagesectionInfo in tblPageSectionInfos)
            {
                var tblPageInfo = _dbContext.TblPages.FirstOrDefault(f => f.Id == tblPagesectionInfo.PageId);
                var tblsectionInfo = _dbContext.TblSections.FirstOrDefault(f => f.Id == tblPagesectionInfo.SectionId);
                var tblSectionControlsInfos = _dbContext.TblSectionControls.Where(f => f.SectionId == tblPagesectionInfo.SectionId).ToList();

                var sectionWithControls = new SectionWithControls();
                foreach (var tblSectionControlsInfo in tblSectionControlsInfos)
                {
                    var tblControlInfos = _dbContext.TblControls.FirstOrDefault(f => f.Id == tblSectionControlsInfo.ControlId);
                    var tblControlTypeInfo = _dbContext.TblControlTypes.FirstOrDefault(f => f.ControlId == tblControlInfos.TypeOfControl);

                    sectionWithControls.PageId = tblPageInfo.Id;
                    sectionWithControls.SectionId = tblsectionInfo.Id;
                    sectionWithControls.SectionName = tblsectionInfo.SectionName;

                    Control control = new Control()
                    {
                        ControlId = tblControlInfos.Id,
                        SystemFieldName = tblControlInfos.ControlKey,
                        DisplayFieldName = tblControlInfos.ControlName,
                        UITypeId = tblControlTypeInfo.ControlId,
                        UIType = tblControlTypeInfo.ControlName,
                        Required = tblControlInfos.IsSystemRequired,
                        Visible = tblControlInfos.IsActive,
                        DefaultValue = tblControlInfos.DefaultValue,
                        Options = tblControlInfos.Options,
                        SortOrder = tblControlInfos.SortOrder,

                        IsNew = false
                    };
                    sectionWithControls.Fields.Add(control);

                }
                controls.Add(sectionWithControls);
            }
            return controls;
        }
        public List<SectionWithControls> LoadSystemFieldsForClient(int pageId)
        {
            var response = new RequestResponse<List<SectionWithControls>>();

            var allPageSections = new List<SectionWithControls>();
            var allLabSections = _applicationDbContext.TblLabPageSections.Where(x => x.PageId == pageId).OrderBy(x => x.SortOrder).ToList();
            var allLabSectionsIdslst = allLabSections.Select(x => x.SectionId).ToList();

            var allLabControls = _applicationDbContext.TblLabSectionControls.Where(x => allLabSectionsIdslst.Contains(x.SectionId)).ToList();


            var tblPageSectionInfos = _dbContext.TblPageSections.Where(f => f.PageId == pageId).ToList();
            var allSectionsIds = tblPageSectionInfos.Select(x => x.SectionId).ToList();

            var tblSectionsInfos = _dbContext.TblSections.Where(x => allSectionsIds.Contains(x.Id)).ToList();

            var tblsectionControls = _dbContext.TblSectionControls.Where(x => allSectionsIds.Contains(x.SectionId.Value)).ToList();


            var allControlsIdslst = tblsectionControls.Select(x => x.ControlId).ToList();
            var allControls = _dbContext.TblControls.Where(x => allControlsIdslst.Contains(x.Id)).Select(x => new TrueMed.Sevices.MasterEntities.TblControl()
            {
                ControlKey = x.ControlKey,
                ControlName = x.ControlName,
                DisplayType = x.DisplayType,
                IsSystemRequired = x.IsSystemRequired,
                CssStyle = x.CssStyle,
                Id = x.Id,
                IsActive = x.IsActive,
                DefaultValue = x.DefaultValue,
                SortOrder = x.SortOrder,
                TypeOfControl = x.TypeOfControl ?? 200000,// issue
                TypeOfSection = x.TypeOfSection,
                Options = x.Options,


            }).ToList();
            var AlltblControlTypeInfo = _dbContext.TblControlTypes.ToList();
            foreach (var section in allLabSections)
            {
                var isSectionEXist = allPageSections.Any(x => x.SectionId == section.SectionId);
                if (isSectionEXist)
                    continue;



                var labSection = tblPageSectionInfos.FirstOrDefault(x => x.SectionId == section.SectionId);

                var sectionWithControls = new SectionWithControls();

                sectionWithControls.SectionName = section?.SectionName;
                sectionWithControls.SectionId = section?.SectionId ?? 0;
                sectionWithControls.PageId = pageId;
                sectionWithControls.IsSelected = section.IsSelected;
                sectionWithControls.Fields = new List<Control>();



                var AllfieldsOfSectionIDslst = allLabControls.Where(x => x.SectionId == section.SectionId)
                                                .Select(x => x.ControlId)
                                                .ToList();

                if (AllfieldsOfSectionIDslst.Count == 0)
                    continue;


                //  var allSectionControls = allControls.Where(x => AllfieldsOfSectionIDslst.Contains(x.Id)).ToList();
                var allSectionControls = allControls.Where(x => AllfieldsOfSectionIDslst.Contains(x.Id) && x.TblSectionControls.Any(x => x.SectionId == section.SectionId)).ToList();

                if (allSectionControls.Count == 0)
                    continue;
                foreach (var f in allSectionControls)
                {
                    var lc = allLabControls.FirstOrDefault(x => x.ControlId == f.Id);

                    if (!lc?.IsVisible ?? true)
                        continue;
                    Control c = new Control()
                    {
                        ControlId = f.Id,
                        CssStyle = string.IsNullOrEmpty(lc?.CssStyle) ? f.CssStyle ?? "" : lc?.CssStyle,
                        DefaultValue = string.IsNullOrEmpty(lc?.DefaultValue) ? f.DefaultValue ?? "" : lc?.DefaultValue,
                        DisplayFieldName = string.IsNullOrEmpty(lc?.ControlName) ? f.ControlName ?? "" : lc?.ControlName,
                        DisplayType = string.IsNullOrEmpty(lc?.DisplayType) ? f.DisplayType ?? "col-lg-6 col-md-6 col-sm-12" : lc?.DisplayType,
                        IsNew = false,
                        Options = string.IsNullOrEmpty(lc?.Options) ? f.Options ?? "" : lc?.Options,
                        Required = lc?.IsSystemRequired == null ? f.IsSystemRequired : lc?.IsSystemRequired ?? false,
                        SectionType = (SectionType)(f.TypeOfSection ?? 0),
                        SortOrder = lc?.SortOrder == null ? f.SortOrder : lc.SortOrder,
                        SystemFieldName = string.IsNullOrEmpty(lc?.ControlKey) ? f.ControlKey ?? "" : lc?.ControlKey,
                        UIType = AlltblControlTypeInfo.FirstOrDefault(x => x.ControlId == f.TypeOfControl)?.ControlName,
                        UITypeId = AlltblControlTypeInfo.FirstOrDefault(x => x.ControlId == f.TypeOfControl)?.ControlId ?? 1000000,
                        Visible = lc?.IsVisible == null ? f.IsActive : lc.IsVisible
                    };
                    sectionWithControls.Fields.Add(c);
                }
                sectionWithControls.Fields = sectionWithControls.Fields.OrderBy(x => x.SortOrder).ToList();
                allPageSections.Add(sectionWithControls);


            }




            return allPageSections;
        }

        public List<SectionWithControlsAndDependenciesClient> LoadSystemFieldsForClientV2(int pageId)
        {
            var allPageSections = new List<SectionWithControlsAndDependenciesClient>();
            var allLabSections = _applicationDbContext.TblLabPageSections.Where(x => x.PageId == pageId && x.IsReqSection == 0).AsNoTracking().ToList();
            var allLabSectionsIdslst = allLabSections.Select(x => x.SectionId).ToList();

            var allLabControls = _applicationDbContext.TblLabSectionControls.Where(x => allLabSectionsIdslst.Contains(x.SectionId)).AsNoTracking().ToList();


            var tblPageSectionInfos = _dbContext.TblPageSections.Where(f => f.PageId == pageId).AsNoTracking().ToList();
            var allSectionsIds = tblPageSectionInfos.Select(x => x.SectionId).ToList();

            var tblSectionsInfos = _dbContext.TblSections.Where(x => allSectionsIds.Contains(x.Id)).AsNoTracking().ToList();

            var tblsectionControls = _dbContext.TblSectionControls.Where(x => allSectionsIds.Contains(x.SectionId.Value)).AsNoTracking().ToList();


            var allControlsIdslst = tblsectionControls.Select(x => x.ControlId).ToList();
            var allControlOptions = _dbContext.TblControlOptions.AsNoTracking().ToList();
            var allDepedencyControlOPtion = _dbContext.TblControlOptionDependencies.AsNoTracking().ToList();

            var allControls = _dbContext.TblControls.Where(x => allControlsIdslst.Contains(x.Id)).AsNoTracking().Select(x => new TrueMed.Sevices.MasterEntities.TblControl()
            {
                ControlKey = x.ControlKey,
                ControlName = x.ControlName,
                DisplayType = x.DisplayType,
                IsSystemRequired = x.IsSystemRequired,
                CssStyle = x.CssStyle,
                Id = x.Id,
                IsActive = x.IsActive,
                DefaultValue = x.DefaultValue,
                SortOrder = x.SortOrder,
                TypeOfControl = x.TypeOfControl ?? 200000,// issue
                TypeOfSection = x.TypeOfSection,
                Options = x.Options

            }).ToList();
            var AlltblControlTypeInfo = _dbContext.TblControlTypes.ToList();
            var allLabControlOptions = _applicationDbContext.TblLabControlOptions.AsNoTracking().ToList();
            var allLabDepedencyControlOPtion = _applicationDbContext.TblLabControlOptionDependencies.AsNoTracking().ToList();
            foreach (var labSection in allLabSections)
            {
                #region Section
                var isSectionExist = allPageSections.Any(x => x.SectionId == labSection.SectionId);
                if (isSectionExist)
                    continue;

                var section = tblPageSectionInfos.FirstOrDefault(x => x.SectionId == labSection.SectionId);
                if (string.IsNullOrEmpty(labSection?.SectionName))
                    continue;


                var sectionWithControls = new SectionWithControlsAndDependenciesClient();

                sectionWithControls.SectionName = labSection?.SectionName;
                sectionWithControls.SectionId = labSection?.SectionId ?? 0;
                sectionWithControls.PageId = pageId;
                sectionWithControls.IsSelected = labSection?.IsSelected ?? false;
                sectionWithControls.SortOrder = labSection?.SortOrder != null ? labSection?.SortOrder : section?.Section?.Order ?? 10000;
                sectionWithControls.DisplayType = string.IsNullOrEmpty(labSection?.DisplayType) ? "col-lg-6 col-md-6 col-sm-12" : labSection?.DisplayType ?? "";
                sectionWithControls.CssStyle = string.IsNullOrEmpty(labSection?.CssStyle ?? "") ? "" : labSection?.CssStyle ?? "";
                sectionWithControls.CustomScript = string.IsNullOrEmpty(labSection.CustomScript ?? "") ? "" : labSection.CustomScript ?? "";
                #endregion
                sectionWithControls.Fields = new List<ControlWithDependenciesClient>();
                sectionWithControls.DependencyControls = new List<DependencyControlsClient>();


                var AllfieldsOfSectionIDslst = allLabControls.Where(x => x.SectionId == labSection.SectionId)
                                                .Select(x => x.ControlId)
                                                .ToList();

                if (AllfieldsOfSectionIDslst.Count == 0)
                {
                    allPageSections.Add(sectionWithControls);
                    continue;
                }

                //  var allSectionControls = allControls.Where(x => AllfieldsOfSectionIDslst.Contains(x.Id)).ToList();
                var allSectionControls = allControls.Where(x => AllfieldsOfSectionIDslst.Contains(x.Id)).OrderBy(x => x.SortOrder).ToList();

                if (allSectionControls.Count == 0)
                    continue;


                // for Repeat Control 
                bool isRepeateControl = false;
                var rc = new ControlWithDependenciesClient();
                rc.RepeatFields = new List<ControlWithDependenciesClient>();
                rc.RepeatDependencyControls = new List<DependencyControlsClient>();

                foreach (var f in allSectionControls)
                {



                    if (f.TypeOfControl == 25)// Repeat Start
                    {
                        rc = new ControlWithDependenciesClient();
                        rc.RepeatFields = new List<ControlWithDependenciesClient>();
                        rc.RepeatDependencyControls = new List<DependencyControlsClient>();
                        rc.UIType = "Repeat";
                        rc.UITypeId = 33;
                        rc.SortOrder = f.SortOrder;
                        rc.DisplayFieldName = f.ControlName;
                        rc.Visible = true;
                        isRepeateControl = true;

                        var repeatStart = GetControlWithDependenciesforClient(f, allLabControls,
                         allControlOptions, allControls, allDepedencyControlOPtion,
                         AlltblControlTypeInfo, false, allLabControlOptions, allLabDepedencyControlOPtion, "", sectionWithControls.SectionId);

                        rc.RepeatFieldsState.Add(repeatStart.Fields);
                        rc.RepeatDependencyControlsState.AddRange(repeatStart.DependencyControls.ToList());
                        continue;
                    }
                    if (f.TypeOfControl == 26)// Repeat End
                    {
                        rc.RepeatFields = rc.RepeatFields.OrderBy(x => x.SortOrder).ToList();
                        sectionWithControls.Fields.Add(rc);
                        isRepeateControl = false;
                        continue;
                    }
                    var controlsAndDependent = GetControlWithDependenciesforClient(f, allLabControls,
                        allControlOptions, allControls, allDepedencyControlOPtion,
                        AlltblControlTypeInfo, false, allLabControlOptions, allLabDepedencyControlOPtion, "", sectionWithControls.SectionId);

                    // Commented for repeat control
                    //sectionWithControls.Fields.Add(controlsAndDependent.Fields);
                    //sectionWithControls.DependencyControls.AddRange(controlsAndDependent.DependencyControls.ToList());

                    // added for repeatControl
                    if (!isRepeateControl)
                    {
                        sectionWithControls.Fields.Add(controlsAndDependent.Fields);
                        sectionWithControls.DependencyControls.AddRange(controlsAndDependent.DependencyControls.ToList());
                    }
                    else
                    {
                        rc.RepeatFields.Add(controlsAndDependent.Fields);
                        rc.RepeatDependencyControls.AddRange(controlsAndDependent.DependencyControls.ToList());

                        rc.RepeatFieldsState.Add(controlsAndDependent.Fields);
                        rc.RepeatDependencyControlsState.AddRange(controlsAndDependent.DependencyControls.ToList());
                    }
                }
                sectionWithControls.Fields = sectionWithControls.Fields.OrderBy(x => x.SortOrder).ToList();
                allPageSections.Add(sectionWithControls);
            }
            // Removing duplicates from dependencies
            foreach (var section in allPageSections)
            {
                var allvisableFields = section.Fields.Where(x => x.Visible == true).ToList();
                var controlsId = section.Fields.Where(x => x.Visible == true).Select(x => x.ControlId).ToList();
                section.Fields = new List<ControlWithDependenciesClient>();
                section.Fields = allvisableFields.ToList();
                //foreach (var fd in section.DependenceyControls)
                //{
                //    var uniqueContlst = fd.DependecyFields.Where(x => !controlsId.Contains(x.ControlId)).ToList();
                //    fd.DependecyFields = new List<ControlWithDependenciesClient>();
                //    fd.DependecyFields.AddRange(uniqueContlst);

                //    //foreach (var dep in fd.DependecyFields)
                //    //{

                //    //    dep.DependecyFields = new List<ControlWithDependencies>();
                //    //    dep.DependecyFields.AddRange(uniqueContlst);
                //    //}
                //}


            }

            return allPageSections.OrderBy(x => x.SortOrder).ToList();
        }
        public RequestResponse<List<SectionWithControls>> LoadSystemFieldsForAdmin(int pageId)
        {
            var response = new RequestResponse<List<SectionWithControls>>();

            var allPageSections = new List<SectionWithControls>();
            var allLabSections = _applicationDbContext.TblLabPageSections.Where(x => x.PageId == pageId).ToList();
            var allLabSectionsIdslst = allLabSections.Select(x => x.SectionId).ToList();

            var allLabControls = _applicationDbContext.TblLabSectionControls.Where(x => allLabSectionsIdslst.Contains(x.SectionId)).ToList();


            var tblPageSectionInfos = _dbContext.TblPageSections.Where(f => f.PageId == pageId).ToList();
            var allSectionsIds = tblPageSectionInfos.Select(x => x.SectionId).ToList();

            var tblSectionsInfos = _dbContext.TblSections.Where(x => allSectionsIds.Contains(x.Id)).ToList();

            var tblsectionControls = _dbContext.TblSectionControls.Where(x => allSectionsIds.Contains(x.SectionId.Value)).ToList();


            var allControlsIdslst = tblsectionControls.Select(x => x.ControlId).ToList();
            var allControls = _dbContext.TblControls.Where(x => allControlsIdslst.Contains(x.Id)).Select(x => new TrueMed.Sevices.MasterEntities.TblControl()
            {
                ControlKey = x.ControlKey,
                ControlName = x.ControlName,
                DisplayType = x.DisplayType,
                IsSystemRequired = x.IsSystemRequired,
                CssStyle = x.CssStyle,
                Id = x.Id,
                IsActive = x.IsActive,
                DefaultValue = x.DefaultValue,
                SortOrder = x.SortOrder,
                TypeOfControl = x.TypeOfControl ?? 200000,// issue
                TypeOfSection = x.TypeOfSection,
                Options = x.Options,


            }).ToList();
            var AlltblControlTypeInfo = _dbContext.TblControlTypes.ToList();
            foreach (var section in tblPageSectionInfos)
            {
                var isSectionEXist = allPageSections.Any(x => x.SectionId == section.SectionId);
                if (isSectionEXist)
                    continue;


                if (string.IsNullOrEmpty(section?.Section?.SectionName))
                    continue;
                var labSection = allLabSections.FirstOrDefault(x => x.SectionId == section.SectionId);

                var sectionWithControls = new SectionWithControls();

                sectionWithControls.SectionName = section?.Section?.SectionName;
                sectionWithControls.SectionId = section?.SectionId ?? 0;
                sectionWithControls.PageId = pageId;
                sectionWithControls.IsSelected = labSection?.IsSelected ?? false;
                sectionWithControls.Fields = new List<Control>();



                var AllfieldsOfSectionIDslst = tblsectionControls.Where(x => x.SectionId == section.SectionId)
                                                .Select(x => x.ControlId)
                                                .ToList();

                if (AllfieldsOfSectionIDslst.Count == 0)
                    continue;
                //{
                //    allPageSections.Add(sectionWithControls);
                //    continue;
                //}

                //  var allSectionControls = allControls.Where(x => AllfieldsOfSectionIDslst.Contains(x.Id)).ToList();
                var allSectionControls = allControls.Where(x => AllfieldsOfSectionIDslst.Contains(x.Id)).ToList();

                if (allSectionControls.Count == 0)
                    continue;
                //{
                //    allPageSections.Add(sectionWithControls);
                //    continue;
                //}
                foreach (var f in allSectionControls)
                {
                    var lc = allLabControls.FirstOrDefault(x => x.ControlId == f.Id);


                    Control c = new Control()
                    {
                        ControlId = f.Id,
                        CssStyle = string.IsNullOrEmpty(lc?.CssStyle) ? f.CssStyle ?? "" : lc?.CssStyle,
                        DefaultValue = string.IsNullOrEmpty(lc?.DefaultValue) ? f.DefaultValue ?? "" : lc?.DefaultValue,
                        DisplayFieldName = string.IsNullOrEmpty(lc?.ControlName) ? f.ControlName ?? "" : lc?.ControlName,
                        DisplayType = string.IsNullOrEmpty(lc?.DisplayType) ? f.DisplayType ?? "col-lg-6 col-md-6 col-sm-12" : lc?.DisplayType,
                        IsNew = false,
                        Options = string.IsNullOrEmpty(lc?.Options) ? f.Options ?? "" : lc?.Options,
                        Required = lc?.IsSystemRequired == null ? f.IsSystemRequired : lc?.IsSystemRequired,
                        SectionType = (SectionType)(f.TypeOfSection ?? 0),
                        SortOrder = lc?.SortOrder == null ? f.SortOrder : lc.SortOrder,
                        SystemFieldName = string.IsNullOrEmpty(lc?.ControlKey) ? f.ControlKey ?? "" : lc?.ControlKey,
                        UIType = AlltblControlTypeInfo.FirstOrDefault(x => x.ControlId == f.TypeOfControl)?.ControlName,
                        UITypeId = AlltblControlTypeInfo.FirstOrDefault(x => x.ControlId == f.TypeOfControl)?.ControlId ?? 1000000,
                        Visible = lc?.IsVisible == null ? f.IsActive : lc.IsVisible
                    };

                    sectionWithControls.Fields.Add(c);


                }
                sectionWithControls.Fields = sectionWithControls.Fields.OrderBy(x => x.SortOrder).ToList();
                allPageSections.Add(sectionWithControls);


            }





            response.Data = allPageSections;
            response.Message = "Request Processed...";
            response.HttpStatusCode = Status.Success;
            return response;
        }
        public RequestResponse<List<SectionWithControlsAndDependencies>> LoadSystemFieldsForAdminV2(int pageId)
        {
            var response = new RequestResponse<List<SectionWithControlsAndDependencies>>();

            var allPageSections = new List<SectionWithControlsAndDependencies>();
            var allLabSections = _applicationDbContext.TblLabPageSections.Where(x => x.PageId == pageId && x.IsReqSection == 0).ToList();
            var allLabSectionsIdslst = allLabSections.Select(x => x.SectionId).ToList();

            var allLabControls = _applicationDbContext.TblLabSectionControls.Where(x => allLabSectionsIdslst.Contains(x.SectionId)).AsNoTracking().ToList();


            var tblPageSectionInfos = _dbContext.TblPageSections.Where(f => f.PageId == pageId && f.IsReqSection == 0).ToList();
            var allSectionsIds = tblPageSectionInfos.Select(x => x.SectionId).ToList();

            var tblSectionsInfos = _dbContext.TblSections.Where(x => allSectionsIds.Contains(x.Id)).AsNoTracking().ToList();

            var tblsectionControls = _dbContext.TblSectionControls.Where(x => allSectionsIds.Contains(x.SectionId.Value)).AsNoTracking().ToList();


            var allControlsIdslst = tblsectionControls.Select(x => x.ControlId).ToList();
            var allControlOptions = _dbContext.TblControlOptions.AsNoTracking().ToList();
            var allDepedencyControlOPtion = _dbContext.TblControlOptionDependencies.AsNoTracking().ToList();
            var allLabControlOptions = _applicationDbContext.TblLabControlOptions.AsNoTracking().ToList();
            var allLabDepedencyControlOPtion = _applicationDbContext.TblLabControlOptionDependencies.AsNoTracking().ToList();

            var allControls = _dbContext.TblControls.Where(x => allControlsIdslst.Contains(x.Id)).AsNoTracking().Select(x => new TrueMed.Sevices.MasterEntities.TblControl()
            {
                ControlKey = x.ControlKey,
                ControlName = x.ControlName,
                DisplayType = x.DisplayType,
                IsSystemRequired = x.IsSystemRequired,
                CssStyle = x.CssStyle,
                Id = x.Id,
                IsActive = x.IsActive,
                DefaultValue = x.DefaultValue,
                SortOrder = x.SortOrder,
                TypeOfControl = x.TypeOfControl ?? 200000,// issue
                TypeOfSection = x.TypeOfSection,
                Options = x.Options,


            }).ToList();
            var AlltblControlTypeInfo = _dbContext.TblControlTypes.ToList();

            foreach (var section in tblPageSectionInfos)
            {
                #region Section
                var isSectionExist = allPageSections.Any(x => x.SectionId == section.SectionId);
                if (isSectionExist)
                    continue;
                var SectionInfo = tblSectionsInfos.FirstOrDefault(x => x.Id == section.SectionId);

                if (string.IsNullOrEmpty(SectionInfo?.SectionName))
                    continue;
                var labSection = allLabSections.FirstOrDefault(x => x.SectionId == section.SectionId);

                var sectionWithControls = new SectionWithControlsAndDependencies();

                sectionWithControls.SectionName = SectionInfo?.SectionName;
                sectionWithControls.SectionId = section?.SectionId ?? 0;
                sectionWithControls.PageId = pageId;
                sectionWithControls.IsSelected = labSection?.IsSelected ?? false;
                sectionWithControls.SortOrder = labSection?.SortOrder != null ? labSection?.SortOrder : SectionInfo?.Order ?? 10000;
                sectionWithControls.DisplayType = labSection?.DisplayType ?? "col-lg-6 col-md-6 col-sm-12";
                sectionWithControls.CssStyle = labSection?.CssStyle ?? "";
                sectionWithControls.CustomScript = labSection.CustomScript ?? "";

                #endregion
                sectionWithControls.Fields = new List<ControlWithDependencies>();
                //   sectionWithControls.Options = new List<MasterPortalAppManagement.Domain.Models.Dtos.Response.Option>();


                var AllfieldsOfSectionIDslst = tblsectionControls.Where(x => x.SectionId == section.SectionId)
                                                .Select(x => x.ControlId)
                                                .ToList();

                if (AllfieldsOfSectionIDslst.Count == 0)
                    continue;


                //  var allSectionControls = allControls.Where(x => AllfieldsOfSectionIDslst.Contains(x.Id)).ToList();
                var allSectionControls = allControls.Where(x => AllfieldsOfSectionIDslst.Contains(x.Id)).ToList();

                if (allSectionControls.Count == 0)
                    continue;
                foreach (var f in allSectionControls)
                {
                    ControlWithDependencies c = GetControlWithDependencies(f, allLabControls,
                        allControlOptions, allControls, allDepedencyControlOPtion,
                        AlltblControlTypeInfo, false, allLabControlOptions, allLabDepedencyControlOPtion);

                    sectionWithControls.Fields.Add(c);

                    //     sectionWithControls.Options.AddRange(c.Options);


                }
                sectionWithControls.Fields = sectionWithControls.Fields.OrderBy(x => x.SortOrder).ToList();
                allPageSections.Add(sectionWithControls);


            }





            response.Data = allPageSections;
            response.Message = "Request Processed...";
            response.HttpStatusCode = Status.Success;
            return response;
        }

        private ControlWithDependencies GetControlWithDependencies(Sevices.MasterEntities.TblControl f, List<TblLabSectionControl> allLabControls,
            List<Sevices.MasterEntities.TblControlOption> allControlOptions, List<Sevices.MasterEntities.TblControl> allControls,
            List<TblControlOptionDependency> allDepedencyControlOPtion, List<Sevices.MasterEntities.TblControlType> alltblControlTypeInfo, bool isAdmin, List<TblLabControlOption> allLabControlOptions, List<TblLabControlOptionDependency> allLabDepedencyControlOPtion)
        {
            #region Control collection of above section
            ControlWithDependencies c = new ControlWithDependencies();
            var lc = allLabControls.FirstOrDefault(x => x.ControlId == f.Id);

            c.ControlId = f.Id;
            c.CssStyle = string.IsNullOrEmpty(lc?.CssStyle) ? f.CssStyle ?? "" : lc?.CssStyle;
            c.DefaultValue = string.IsNullOrEmpty(lc?.DefaultValue) ? f.DefaultValue ?? "" : lc?.DefaultValue;
            c.DisplayFieldName = string.IsNullOrEmpty(lc?.ControlName) ? f.ControlName ?? "" : lc?.ControlName;
            c.DisplayType = string.IsNullOrEmpty(lc?.DisplayType) ? f.DisplayType ?? "col-lg-6 col-md-6 col-sm-12" : lc?.DisplayType;
            c.IsNew = false;
            //  c.Options = string.IsNullOrEmpty(lc?.Options) ? f.Options ?? "" : lc?.Options;
            c.Required = lc?.IsSystemRequired == null ? f?.IsSystemRequired ?? false : lc.IsSystemRequired;
            c.SectionType = (SectionType)(f.TypeOfSection ?? 0);
            c.SortOrder = lc?.SortOrder == null ? f.SortOrder : lc.SortOrder;
            c.SystemFieldName = string.IsNullOrEmpty(lc?.ControlKey) ? f.ControlKey ?? "" : lc?.ControlKey;
            c.UIType = alltblControlTypeInfo.FirstOrDefault(x => x.ControlId == f.TypeOfControl)?.ControlName;
            c.UITypeId = alltblControlTypeInfo.FirstOrDefault(x => x.ControlId == f.TypeOfControl)?.ControlId ?? 1000000;
            c.Visible = lc?.IsVisible == null ? f.IsActive : lc.IsVisible;

            #endregion
            c.DependenceyControls = new List<DependenceyControls>();
            #region Get Option Of Each Control and its Dependency
            // getting option for control
            c.Options = new List<MasterPortalAppManagement.Domain.Models.Dtos.Response.Option>();
            var controlOptions = allLabControlOptions.Where(x => x.ControlId == f.Id).ToList();
            if (controlOptions.Count != 0)
            {
                foreach (var option in controlOptions)
                {
                    var o = new MasterPortalAppManagement.Domain.Models.Dtos.Response.Option();
                    o.Name = c.SystemFieldName;
                    o.Label = option.OptionName;
                    o.id = option.OptionId;
                    o.Value = option.OptionValue;
                    o.isSelectedDefault = option.IsDefaultSelected;
                    c.Options.Add(o);
                    o.DependenceyControls = new List<ControlWithDependencies>();
                    var depenencyFields = allLabDepedencyControlOPtion.Where(x => x.ControlId == c.ControlId && x.OptionId == o.id).ToList();
                    if (depenencyFields.Count == 0)
                        continue;

                    var dc = new DependenceyControls();
                    dc.optionID = option.OptionId;
                    dc.Value = option.OptionValue;
                    dc.Name = c.SystemFieldName;
                    dc.Label = option.OptionName;

                    dc.DependecyFields = new List<ControlWithDependencies>();

                    foreach (var d in depenencyFields)
                    {


                        var df = allControls.FirstOrDefault(x => x.Id == d.DependentControlId);
                        if (df == null)
                            continue;
                        var depField = GetControlWithDependencies(df, allLabControls, allControlOptions, allControls, allDepedencyControlOPtion,
                            alltblControlTypeInfo, isAdmin, allLabControlOptions, allLabDepedencyControlOPtion); if (isAdmin) { o.DependenceyControls.Add(depField); }

                        dc.DependencyAction = d.DependencyAction ?? "";
                        dc.DependecyFields.Add(depField);


                    }

                    if (!isAdmin)
                        c.DependenceyControls.Add(dc);




                }

            }

            return c;
            #endregion
        }


        private ControlWithDependencies GetControlWithDependenciesForMaster(Sevices.MasterEntities.TblControl f, List<TblLabSectionControl> allLabControls,
            List<Sevices.MasterEntities.TblControlOption> allControlOptions, List<Sevices.MasterEntities.TblControl> allControls,
            List<TblControlOptionDependency> allDepedencyControlOPtion, List<Sevices.MasterEntities.TblControlType> alltblControlTypeInfo,
            bool isAdmin, List<TblLabControlOption> allLabControlOptions, List<TblLabControlOptionDependency> allLabDepedencyControlOPtion,
            int? sectionId, bool isDependecyControl = false, List<int> PortalTypeIds = null)
        {
            #region Control collection of above section
            ControlWithDependencies c = new ControlWithDependencies();
            var lc = allLabControls.FirstOrDefault(x => x.ControlId == f.Id && x.SectionId == sectionId);

            c.ControlId = f.Id;
            c.CssStyle = string.IsNullOrEmpty(lc?.CssStyle) ? f.CssStyle ?? "" : lc?.CssStyle;
            c.DefaultValue = string.IsNullOrEmpty(lc?.DefaultValue) ? f.DefaultValue ?? "" : lc?.DefaultValue;
            c.DisplayFieldName = string.IsNullOrEmpty(lc?.ControlName) ? f.ControlName ?? "" : lc?.ControlName;
            c.DisplayType = string.IsNullOrEmpty(lc?.DisplayType) ? f.DisplayType ?? "col-lg-6 col-md-6 col-sm-12" : lc?.DisplayType;
            c.IsNew = false;
            //  c.Options = string.IsNullOrEmpty(lc?.Options) ? f.Options ?? "" : lc?.Options;
            c.Required = lc?.IsSystemRequired == null ? f?.IsSystemRequired ?? false : lc.IsSystemRequired;
            c.FormatMask = string.IsNullOrEmpty(lc?.FormatMask) ? f.FormatMask ?? "" : lc?.FormatMask;
            c.ColumnValidation = string.IsNullOrEmpty(lc?.ColumnValidation) ? f.ColumnValidation ?? "" : lc?.ColumnValidation;
            c.SectionType = (SectionType)(f.TypeOfSection ?? 0);
            c.SortOrder = lc?.SortOrder == null ? f.SortOrder : lc.SortOrder;
            c.OrderViewSortOrder = lc?.OrderViewSortOrder == null ? f.OrderViewSortOrder : lc.OrderViewSortOrder;
            c.OrderViewDisplayType = string.IsNullOrEmpty(lc?.OrderViewDisplayType) ? f.OrderViewDisplayType ?? "" : lc?.OrderViewDisplayType;
            c.SystemFieldName = string.IsNullOrEmpty(lc?.ControlKey) ? f.ControlKey ?? "" : lc?.ControlKey;
            c.UIType = alltblControlTypeInfo.FirstOrDefault(x => x.ControlId == f.TypeOfControl)?.ControlName;
            c.UITypeId = alltblControlTypeInfo.FirstOrDefault(x => x.ControlId == f.TypeOfControl)?.ControlId ?? 1000000;
            c.Visible = lc?.IsVisible == null ? f.IsActive : lc.IsVisible;
            c.PortalTypeIds = PortalTypeIds;

            #endregion
            c.DependenceyControls = new List<DependenceyControls>();
            #region Get Option Of Each Control and its Dependency
            // getting option for control
            c.Options = new List<MasterPortalAppManagement.Domain.Models.Dtos.Response.Option>();
            var controlOptions = allControlOptions.Where(x => x.ControlId == f.Id).ToList();
            if (controlOptions.Count != 0)
            {

                foreach (var option in controlOptions)
                {
                    bool isOptionExist = true;

                    var labOption = allLabControlOptions.FirstOrDefault(x => x.ControlId == c.ControlId && x.OptionId == option.OptionId);


                    var o = new MasterPortalAppManagement.Domain.Models.Dtos.Response.Option();
                    o.Name = c.SystemFieldName;
                    o.Label = string.IsNullOrEmpty(labOption?.OptionName) ? option.OptionName : labOption.OptionName;
                    o.id = option.OptionId;
                    o.Value = string.IsNullOrEmpty(labOption?.OptionValue) ? option.OptionValue : labOption.OptionValue;
                    o.isSelectedDefault = labOption == null ? option.IsDefaultSelected : labOption.IsDefaultSelected;
                    o.isVisable = labOption == null ? option.IsVisible ?? false : labOption.IsVisible ?? false;

                    o.DependenceyControls = new List<ControlWithDependencies>();
                    var depenencyFields = allLabDepedencyControlOPtion.Where(x => x.ControlId == c.ControlId && x.OptionId == o.id).ToList();
                    if (depenencyFields.Count == 0)
                    {
                        c.Options.Add(o);
                        continue;

                    }
                    //var dc = new DependenceyControls();
                    //dc.optionID = o.id;
                    //dc.Value = o.Value;
                    //dc.Name = o.Name;
                    //dc.Label = o.Label;


                    //dc.DependecyFields = new List<ControlWithDependencies>();

                    foreach (var d in depenencyFields)
                    {
                        if (d.ControlId == 44 && isDependecyControl)
                            continue;
                        o.DependencyAction = d.DependencyAction ?? "";

                        var df = allControls.FirstOrDefault(x => x.Id == d.DependentControlId);
                        if (df == null)
                            continue;
                        var depField = GetControlWithDependenciesForMaster(df, allLabControls, allControlOptions, allControls, allDepedencyControlOPtion,
                            alltblControlTypeInfo, isAdmin, allLabControlOptions, allLabDepedencyControlOPtion, sectionId, true);
                        o.DependenceyControls.Add(depField);



                    }

                    c.Options.Add(o);
                }

            }

            return c;
            #endregion
        }


        private ControlsAndDependentControlsClient GetControlWithDependenciesforClient(Sevices.MasterEntities.TblControl f, List<TblLabSectionControl> allLabControls,
            List<Sevices.MasterEntities.TblControlOption> allControlOptions, List<Sevices.MasterEntities.TblControl> allControls,
            List<TblControlOptionDependency> allDepedencyControlOPtion, List<Sevices.MasterEntities.TblControlType> alltblControlTypeInfo,
            bool isAdmin, List<TblLabControlOption> allLabControlOptions, List<TblLabControlOptionDependency> allLabDepedencyControlOPtion,
            string dependenciesCssClass = "", int sectionId = 0)
        {
            var lst = new ControlsAndDependentControlsClient();
            lst.DependencyControls = new List<DependencyControlsClient>();

            #region Control collection of above section
            ControlWithDependenciesClient c = new ControlWithDependenciesClient();
            var lc = allLabControls.FirstOrDefault(x => x.ControlId == f.Id && x.SectionId == sectionId);

            c.ControlId = f.Id;
            c.ControlDataID = f.Id;

            c.CssStyle = string.IsNullOrEmpty(lc?.CssStyle) ? f.CssStyle ?? "" : lc?.CssStyle;
            c.DefaultValue = string.IsNullOrEmpty(lc?.DefaultValue) ? f.DefaultValue ?? "" : lc?.DefaultValue;
            c.DisplayFieldName = string.IsNullOrEmpty(lc?.ControlName) ? f.ControlName ?? "" : lc?.ControlName;
            c.DisplayType = string.IsNullOrEmpty(lc?.DisplayType) ? f.DisplayType ?? "col-lg-6 col-md-6 col-sm-12" : lc?.DisplayType;

            c.IsNew = false;
            //  c.Options = string.IsNullOrEmpty(lc?.Options) ? f.Options ?? "" : lc?.Options;
            c.Required = lc?.IsSystemRequired == null ? f?.IsSystemRequired ?? false : lc.IsSystemRequired;
            c.SectionType = (SectionType)(f.TypeOfSection ?? 0);
            c.SortOrder = lc?.SortOrder == null ? f.SortOrder : lc.SortOrder;
            c.SystemFieldName = string.IsNullOrEmpty(lc?.ControlKey) ? f.ControlKey ?? "" : lc?.ControlKey;
            c.DisplayType += " " + dependenciesCssClass;
            c.UIType = alltblControlTypeInfo.FirstOrDefault(x => x.ControlId == f.TypeOfControl)?.ControlName;
            c.UITypeId = alltblControlTypeInfo.FirstOrDefault(x => x.ControlId == f.TypeOfControl)?.ControlId ?? 1000000;
            c.Visible = lc?.IsVisible == null ? f.IsActive : lc.IsVisible;

            #endregion
            c.DependencyControls = new List<DependencyControlsClient>();
            #region Get Option Of Each Control and its Dependency
            // getting option for control
            c.Options = new List<MasterPortalAppManagement.Domain.Models.Dtos.Response.OptionClient>();
            //var controlOptions = allLabControlOptions.Where(x => x.ControlId == f.Id).ToList();
            var controlOptions = allLabControlOptions.Where(x => x.ControlId == f.Id && x.IsVisible == true).ToList();
            if (controlOptions.Count != 0)
            {
                foreach (var option in controlOptions)
                {
                    var o = new MasterPortalAppManagement.Domain.Models.Dtos.Response.OptionClient();
                    o.Name = c.SystemFieldName;

                    o.Label = option.OptionName;
                    o.id = option.OptionId;
                    o.OptionDataID = option.OptionId;
                    o.Value = option.OptionValue;
                    o.isSelectedDefault = option.IsDefaultSelected;
                    c.Options.Add(o);

                    var depenencyFields = allLabDepedencyControlOPtion.Where(x => x.ControlId == c.ControlId && x.OptionId == o.id).ToList();
                    if (depenencyFields.Count == 0)
                        continue;

                    var dc = new DependencyControlsClient();
                    dc.optionID = option.OptionId;
                    dc.OptionDataID = option.OptionId;
                    dc.Value = option.OptionValue;
                    dc.Name = c.SystemFieldName;
                    dc.Label = option.OptionName;
                    dc.DependecyFields = new List<ControlWithDependenciesClient>();

                    foreach (var d in depenencyFields)
                    {
                        if (!String.IsNullOrEmpty(d?.DependencyAction))
                            dc.DependencyAction = d.DependencyAction;
                        var df = allControls.FirstOrDefault(x => x.Id == d.DependentControlId);
                        if (df == null)
                            continue;
                        var depField = GetControlWithDependenciesforClient(df, allLabControls, allControlOptions, allControls, allDepedencyControlOPtion,
                            alltblControlTypeInfo, isAdmin, allLabControlOptions, allLabDepedencyControlOPtion, $"{c.SystemFieldName} {dependenciesCssClass} {o.Value} {option.OptionName + option.OptionId} d-none");
                        dc.DependecyFields.Add(depField.Fields);
                        //foreach(var ctrls in depField.DependenceyControls)
                        //dc.DependecyFields.AddRange(ctrls.DependecyFields.ToList());


                    }
                    lst.DependencyControls.Add(dc);
                }

            }


            // For State Loading
            if (c.SystemFieldName == "State")
            {
                foreach (var option in _lookupManager.USStates_Lookup())
                {
                    var o = new MasterPortalAppManagement.Domain.Models.Dtos.Response.OptionClient();
                    o.Name = c.SystemFieldName;

                    o.Label = option.Name;
                    //  o.id = option.OptionId;
                    //o.OptionDataID = option.OptionId;
                    o.Value = option.Abbreviations; ;
                    o.isSelectedDefault = false;
                    c.Options.Add(o);

                }

            }

            lst.Fields = c;

            return lst;
            #endregion
        }



        public RequestResponse<List<SectionWithControls>> LoadSystemFields(int pageId)
        {
            var response = new RequestResponse<List<SectionWithControls>>();

            var labKey = string.Empty;
            if (_httpContextAccessor.HttpContext.Request.Headers.TryGetValue("X-Portal-Key", out var labId))
            {
                labKey = labId;
            }
            int lab = Convert.ToInt32(_dbContext.TblLabs.FirstOrDefault(f => f.LabKey == labKey).LabId);
            var getSelectedFields = _applicationDbContext.TblLabConfigurations.Where(f => f.PageId == pageId && f.LabId == lab).ToList();
            int IsAlreadyUsePageId = 0;
            var getSystemAllFields = new List<SectionWithControls>();

            foreach (var getSelectedField in getSelectedFields)
            {
                if (getSelectedField.PageId != IsAlreadyUsePageId)
                    getSystemAllFields = GetSystemFieldConfigurations(pageId).ToList();

                IsAlreadyUsePageId = (int)getSelectedField.PageId;

                var previousEntryInList = getSystemAllFields.FirstOrDefault(f => f.SectionId == getSelectedField.SectionId);
                var previousControl = previousEntryInList.Fields.OrderBy(o => o.SortOrder).FirstOrDefault(f => f.ControlId == getSelectedField.ControlId);

                previousControl.DisplayFieldName = getSelectedField.DisplayFieldName;
                previousControl.Required = getSelectedField.Required;
                previousControl.Visible = getSelectedField.Visible;
                previousControl.CssStyle = getSelectedField.CssStyle ?? "";
                previousControl.DisplayType = getSelectedField.DisplayType ?? "col-lg-6 col-md-6 col-sm-12";

                int fieldIndex = previousEntryInList.Fields.FindIndex(f => f.ControlId == getSelectedField.ControlId);
                int mainListIndex = getSystemAllFields.FindIndex(f => f.SectionId == getSelectedField.SectionId);
                previousEntryInList.Fields[fieldIndex] = previousControl;
                getSystemAllFields[mainListIndex] = previousEntryInList;

            }
            response.Data = getSystemAllFields;
            response.Message = "Request Processed...";
            response.HttpStatusCode = Status.Success;
            return response;
        }

        public RequestResponse SaveLabConfiguraion(SaveLabConfigurationRequest request)
        {
            var response = new RequestResponse();

            int customControlId = 0;

            if (request.Controls.Count > 0)
            {
                foreach (var Control in request.Controls)
                {
                    if (Control.IsNew == true && Control.SectionType != null)
                    {
                        var customControl = new Sevices.MasterEntities.TblControl()
                        {
                            ControlKey = Control.SystemFieldName,
                            ControlName = Control.DisplayFieldName,
                            TypeOfControl = Convert.ToInt32(Control.UIType),
                            IsSystemRequired = Convert.ToBoolean(Control.Required),
                            IsActive = Control.Visible,
                            DefaultValue = Control.DefaultValue,
                            Options = Control.Options,
                            SortOrder = Control.SortOrder,
                            TypeOfSection = Convert.ToInt32(Control.SectionType),




                            CreatedBy = "Manual"

                        };
                        _dbContext.TblControls.Add(customControl);
                    }
                    else
                    {
                        var customControl = new Sevices.MasterEntities.TblControl()
                        {
                            Id = Control.ControlId,
                            ControlKey = Control.SystemFieldName,
                            ControlName = Control.DisplayFieldName,
                            TypeOfControl = Convert.ToInt32(Control.UIType),
                            IsSystemRequired = Convert.ToBoolean(Control.Required),
                            IsActive = Control.Visible,
                            DefaultValue = Control.DefaultValue,
                            Options = Control.Options,
                            SortOrder = Control.SortOrder,
                            TypeOfSection = Convert.ToInt32(Control.SectionType),

                            CreatedBy = "Manual"

                        };
                        _dbContext.TblControls.Update(customControl);
                    }
                }
            }
            var ack = _dbContext.SaveChanges();
            if (ack > 0)
            {

                response.Message = "Request processed...";
                response.HttpStatusCode = Status.Success;
            }
            return response;
        }

        public RequestResponse SaveSectionAndControls(SaveLabConfigurationRequest request, IConnectionManager connectionManager)
        {
            var response = new RequestResponse();

            //var lab = _dbContext.TblLabs.FirstOrDefault(x => x.LabId == request.LabId);
            //var secretManagement = connectionManager.GetService<ISecretManagement>();
            //var secretValue = secretManagement.GetSecret(lab.LabKey);
            //if (secretValue == null)
            //    connectionManager.Throw_Invalid_X_Portal_Key_Error(secretValue.Value);

            //   var labAppDbContext = ApplicationDbContext.Create(secretValue.Value);
            _dbContext.ChangeTracker.QueryTrackingBehavior = QueryTrackingBehavior.NoTracking;
            _applicationDbContext.ChangeTracker.QueryTrackingBehavior = QueryTrackingBehavior.NoTracking;
            try
            {
                bool isSectionExist = true;
                var section = _applicationDbContext.TblLabPageSections.FirstOrDefault(x => x.SectionId == request.SectionId);
                if (section == null)
                {
                    isSectionExist = false;
                    section = new TblLabPageSection();
                }
                section.SectionName = request.SectionName;
                section.IsReqSection = request.IsReqSection;
                section.LabId = request.LabId;
                section.SectionId = request.SectionId;
                section.IsSelected = request.IsSelected;
                section.PageId = request.PageId;
                if (!section.CreatedDate.HasValue)
                {
                    section.CreatedDate = DateTime.UtcNow;
                    section.CreatedBy = _httpContextAccessor.HttpContext.User.GetUserId();
                }

                if (!isSectionExist)
                    _applicationDbContext.TblLabPageSections.Add(section);
                else
                    _applicationDbContext.TblLabPageSections.Update(section);
                _applicationDbContext.SaveChanges();

                var lstControlIds = request.Controls.Select(x => (int?)x.ControlId).ToList();
                var allControls = _applicationDbContext.TblLabSectionControls.Where(x => lstControlIds.Contains(x.ControlId)).ToList();

                var allmasterControl = _dbContext.TblControls.Select(x => new TrueMed.Sevices.MasterEntities.TblControl()
                {
                    ControlKey = x.ControlKey,
                    ControlName = x.ControlName,
                    DisplayType = x.DisplayType,
                    IsSystemRequired = x.IsSystemRequired,
                    CssStyle = x.CssStyle,
                    Id = x.Id,
                    IsActive = x.IsActive,
                    DefaultValue = x.DefaultValue,
                    SortOrder = x.SortOrder,
                    TypeOfControl = x.TypeOfControl ?? 200000,// issue
                    TypeOfSection = x.TypeOfSection,
                    Options = x.Options,


                }).Where(x => lstControlIds.Contains(x.Id)).ToList();


                foreach (var Control in request.Controls)
                {
                    var customControl = new Sevices.MasterEntities.TblControl();

                    if (Control.IsNew == true && Control.SectionType != null)
                    {
                        customControl = new Sevices.MasterEntities.TblControl()
                        {
                            ControlKey = Control.SystemFieldName,
                            ControlName = Control.DisplayFieldName,
                            TypeOfControl = Convert.ToInt32(Control.UIType),
                            IsSystemRequired = Convert.ToBoolean(Control.Required),
                            IsActive = false,
                            DefaultValue = Control.DefaultValue,
                            Options = Control.Options,
                            SortOrder = Control.SortOrder,
                            TypeOfSection = Convert.ToInt32(Control.SectionType),
                            DisplayType = Control.DisplayType,
                            CssStyle = Control.CssStyle,
                            CreatedBy = "Manual"

                        };
                        _dbContext.TblControls.Add(customControl);
                        _dbContext.SaveChanges();

                        var a = new Sevices.MasterEntities.TblSectionControl();
                        a.ControlId = customControl.Id;
                        a.SectionId = request.SectionId;
                        _dbContext.TblSectionControls.Add(a);
                        _dbContext.SaveChanges();


                    }


                    bool isControlExist = true;

                    var c = allControls.FirstOrDefault(x => x.ControlId == Control.ControlId);
                    var mc = allmasterControl.FirstOrDefault(x => x.Id == Control.ControlId);

                    if (c == null)
                    {
                        isControlExist = false;
                        c = new TblLabSectionControl();
                    }
                    if (Control.IsNew == true)
                        c.ControlId = customControl.Id;
                    else
                        c.ControlId = Control.ControlId;

                    c.ControlName = Control?.DisplayFieldName ?? "";
                    c.ControlKey = Control?.SystemFieldName ?? "";
                    c.TypeOfControl = Control?.UIType ?? "";
                    c.IsSystemRequired = Control?.Required ?? false;
                    c.TypeOfSection = Control?.SectionType.ToString();
                    c.IsVisible = Control?.Visible;
                    c.DefaultValue = mc?.DefaultValue;
                    c.Options = Control?.Options;
                    c.SortOrder = Control?.SortOrder ?? 10000;
                    c.CssStyle = Control?.CssStyle ?? "";
                    c.DisplayType = Control?.DisplayType ?? "";
                    c.LabId = request.LabId;
                    c.PageId = request.PageId;
                    c.SectionId = request.SectionId;
                    c.UpdatedBy = _httpContextAccessor.HttpContext.User.GetUserId();
                    c.UpdatedDate = DateTime.UtcNow;
                    if (!isControlExist)
                    {
                        c.CreatedBy = _httpContextAccessor.HttpContext.User.GetUserId();
                        c.CreatedDate = DateTime.UtcNow;
                        _applicationDbContext.TblLabSectionControls.Add(c);
                    }
                    else
                        _applicationDbContext.TblLabSectionControls.Update(c);

                }
                _applicationDbContext.SaveChanges();
                response.Message = "Request processed...";
                response.HttpStatusCode = Status.Success;


            }
            catch (Exception ex)
            {
                response.HttpStatusCode = Status.SomethingWentWrong;
                response.Error = ex.Message;

            }


            return response;
        }
        public RequestResponse SaveSectionAndControlsV2(SaveLabConfigurationRequestV2 request, IConnectionManager connectionManager)
        {
            var response = new RequestResponse();



            //TblLabRequisitionType Reqtpe = SaveRequisitionType(request);


            //var lab = _dbContext.TblLabs.FirstOrDefault(x => x.LabId == request.LabId);
            //var secretManagement = connectionManager.GetService<ISecretManagement>();
            //var secretValue = secretManagement.GetSecret(lab.LabKey);
            //if (secretValue == null)
            //    connectionManager.Throw_Invalid_X_Portal_Key_Error(secretValue.Value);

            //   var labAppDbContext = ApplicationDbContext.Create(secretValue.Value);
            _dbContext.ChangeTracker.QueryTrackingBehavior = QueryTrackingBehavior.NoTracking;
            _applicationDbContext.ChangeTracker.QueryTrackingBehavior = QueryTrackingBehavior.NoTracking;
            try
            {
                bool isSectionExist = true;
                var section = _applicationDbContext.TblLabPageSections.FirstOrDefault(x => x.SectionId == request.SectionId);
                if (section == null)
                {
                    isSectionExist = false;
                    section = new TblLabPageSection();
                }
                section.SectionName = request.SectionName;
                section.IsReqSection = request.IsReqSection;
                section.LabId = request.LabId;
                section.SectionId = request.SectionId;
                section.IsSelected = request.IsSelected;
                section.PageId = request.PageId;
                section.DisplayType = request.DisplayType ?? "col-lg-6 col-md-6 col-sm-12";
                section.CssStyle = request.CssStyle ?? "";
                section.CustomScript = request.CustomScript ?? "";
                if (!section.CreatedDate.HasValue)
                {
                    section.CreatedDate = DateTime.UtcNow;
                    section.CreatedBy = _httpContextAccessor.HttpContext.User.GetUserId();
                }

                if (!isSectionExist)
                    _applicationDbContext.TblLabPageSections.Add(section);
                else
                    _applicationDbContext.TblLabPageSections.Update(section);
                _applicationDbContext.SaveChanges();

                var lstControlIds = request.Controls.Select(x => (int?)x.ControlId).ToList();
                var portalTypesOfControls = _applicationDbContext.TblLabControlPortalTypes.Where(w => lstControlIds.Contains(w.ControlId)).ToList();

                var allLabControls = _applicationDbContext.TblLabSectionControls.Where(x => lstControlIds.Contains(x.ControlId)).ToList();
                var alllabControlOptions = _applicationDbContext.TblLabControlOptions.Where(x => lstControlIds.Contains(x.ControlId)).ToList();
                var alllabControlOptionsDependencies = _applicationDbContext.TblLabControlOptionDependencies.Where(x => lstControlIds.Contains(x.ControlId)).ToList();
                var allmasterControl = _dbContext.TblControls.Select(x => new TrueMed.Sevices.MasterEntities.TblControl()
                {
                    ControlKey = x.ControlKey,
                    ControlName = x.ControlName,
                    DisplayType = x.DisplayType,
                    IsSystemRequired = x.IsSystemRequired,
                    CssStyle = x.CssStyle,
                    Id = x.Id,
                    IsActive = x.IsActive,
                    DefaultValue = x.DefaultValue,
                    SortOrder = x.SortOrder,
                    TypeOfControl = x.TypeOfControl ?? 200000,// issue
                    TypeOfSection = x.TypeOfSection,
                    Options = x.Options,
                    FormatMask = x.FormatMask,
                    ColumnValidation = x.ColumnValidation,
                    OrderViewSortOrder = x.OrderViewSortOrder,
                    OrderViewDisplayType = x.OrderViewDisplayType


                }).Where(x => lstControlIds.Contains(x.Id)).ToList();
                var allMasterControlOptions = _dbContext.TblControlOptions.AsNoTracking().Where(x => lstControlIds.Contains(x.ControlId)).ToList();
                var allMasterControlOptionsDependencies = _dbContext.TblControlOptionDependencies.AsNoTracking().Where(x => lstControlIds.Contains(x.ControlId)).ToList();


                foreach (var Control in request.Controls)
                {
                    var customControl = new Sevices.MasterEntities.TblControl();

                    if (Control.IsNew == true && Control.SectionType != null)
                    {
                        customControl = new Sevices.MasterEntities.TblControl()
                        {
                            ControlKey = Control.SystemFieldName,
                            ControlName = Control.DisplayFieldName,
                            TypeOfControl = Convert.ToInt32(Control.UITypeId),
                            IsSystemRequired = Convert.ToBoolean(Control.Required),
                            IsActive = false,
                            DefaultValue = Control.DefaultValue,
                            SortOrder = Control.SortOrder,
                            TypeOfSection = Convert.ToInt32(Control.SectionType),
                            DisplayType = Control.DisplayType,
                            CssStyle = Control.CssStyle,
                            OrderViewDisplayType = Control.OrderViewDisplayType,
                            OrderViewSortOrder = Control.OrderViewSortOrder,
                            ColumnValidation = Control.ColumnValidation,
                            FormatMask = Control.FormatMask,
                            CreatedBy = "Manual",


                        };

                        _dbContext.TblControls.Add(customControl);
                        _dbContext.SaveChanges();
                        allmasterControl.Add(customControl);
                        int order = 0;
                        foreach (var opt in Control.Options.ToList())
                        {
                            order++;
                            var mo = new Sevices.MasterEntities.TblControlOption();
                            mo.ControlId = customControl.Id;
                            mo.OptionValue = opt.Value;
                            mo.OptionName = opt.Name;
                            mo.IsDefaultSelected = opt.isSelectedDefault;
                            mo.CreatedBy = _httpContextAccessor.HttpContext.User.GetUserId();
                            mo.CreatedDate = DateTime.UtcNow;
                            mo.SortOrder = order;
                            mo.IsVisible = opt.isVisable;
                            _dbContext.TblControlOptions.Add(mo);
                            _dbContext.SaveChanges();
                            allMasterControlOptions.Add(mo);
                            if (opt.DependenceyControls != null && opt?.DependenceyControls.Count > 0)
                            {

                                foreach (var dc in opt?.DependenceyControls?.ToList())
                                {
                                    var cod = new Sevices.MasterEntities.TblControlOptionDependency();
                                    cod.CreatedDate = DateTime.UtcNow;
                                    cod.CreatedBy = _httpContextAccessor.HttpContext.User.GetUserId();
                                    cod.ControlId = customControl.Id;
                                    cod.OptionId = mo.OptionId;
                                    cod.DependentControlId = dc.DependenceyControlID;
                                    _dbContext.TblControlOptionDependencies.Add(cod);

                                }
                            }
                            _dbContext.SaveChanges();




                        }




                        var a = new Sevices.MasterEntities.TblSectionControl();
                        a.ControlId = customControl.Id;
                        a.SectionId = request.SectionId;
                        _dbContext.TblSectionControls.Add(a);
                        _dbContext.SaveChanges();



                    }


                    bool isControlExist = true;

                    var c = allLabControls.FirstOrDefault(x => x.ControlId == Control.ControlId && x.SectionId == request.SectionId);
                    var mc = allmasterControl.FirstOrDefault(x => x.Id == Control.ControlId && x.TblSectionControls.Any(x => x.SectionId == request.SectionId));

                    if (c == null)
                    {
                        isControlExist = false;
                        c = new TblLabSectionControl();
                    }
                    if (Control.IsNew == true)
                        c.ControlId = customControl.Id;
                    else
                        c.ControlId = Control.ControlId;

                    c.ControlName = Control?.DisplayFieldName ?? "";
                    c.ControlKey = Control?.SystemFieldName ?? "";
                    c.TypeOfControl = Control?.UIType ?? "";
                    c.IsSystemRequired = Control?.Required ?? false;
                    c.TypeOfSection = Control?.SectionType.ToString();
                    c.IsVisible = Control?.Visible;
                    c.DefaultValue = mc?.DefaultValue;
                    c.SortOrder = Control?.SortOrder ?? 10000;
                    c.CssStyle = Control?.CssStyle ?? "";
                    c.DisplayType = Control?.DisplayType ?? "";
                    c.LabId = request.LabId;
                    c.PageId = request.PageId;
                    c.SectionId = request.SectionId;
                    c.FormatMask = Control?.FormatMask;
                    c.ColumnValidation = Control?.ColumnValidation;
                    c.OrderViewSortOrder = Control?.OrderViewSortOrder;
                    c.OrderViewDisplayType = Control?.OrderViewDisplayType;
                    c.UpdatedBy = _httpContextAccessor.HttpContext.User.GetUserId();
                    c.UpdatedDate = DateTime.UtcNow;
                    if (!isControlExist)
                    {
                        c.CreatedBy = _httpContextAccessor.HttpContext.User.GetUserId();
                        c.CreatedDate = DateTime.UtcNow;
                        _applicationDbContext.TblLabSectionControls.Add(c);
                    }
                    else
                        _applicationDbContext.TblLabSectionControls.Update(c);

                    if (Control.PortalTypeIds.Count() > 0)
                    {

                        var list = new List<TblLabControlPortalType>();
                        foreach (var type in Control.PortalTypeIds)
                        {
                            var existing = portalTypesOfControls.FirstOrDefault(w => w.ControlId == Control.ControlId && w.PortalTypeId == type);
                            if (existing == null)
                            {
                                var portaltype = new TblLabControlPortalType()
                                {
                                    ControlId = Control.ControlId,
                                    PortalTypeId = type,
                                    CreatedBy = _httpContextAccessor.HttpContext.User.GetUserId(),
                                    CreatedDate = DateTime.UtcNow
                                };
                                list.Add(portaltype);
                            }
                        }
                        if(list.Count > 0)
                        {
                            _applicationDbContext.TblLabControlPortalTypes.AddRange(list);
                        }

                    }
                    else
                    {
                        var existingDelete = portalTypesOfControls.Where(w => w.ControlId == Control.ControlId).ToList();
                        if (existingDelete.Count() > 0)
                        {
                            _applicationDbContext.TblLabControlPortalTypes.RemoveRange(existingDelete);
                        }
                    }


                    _applicationDbContext.SaveChanges();
                    var allOptionsOfMaster = allMasterControlOptions.Where(x => x.ControlId == c.ControlId).ToList();

                    int sortorder = 0;
                    foreach (var ropt in Control.Options.ToList())
                    {
                        sortorder++;
                        Sevices.MasterEntities.TblControlOption mopt = SaveMasterTblControlOption(ropt, c, sortorder);
                        bool isOptionExist = true;
                        var labOption = alllabControlOptions.FirstOrDefault(x => x.ControlId == c.ControlId && x.OptionId == mopt.OptionId);
                        if (labOption == null)
                        {
                            isOptionExist = false;
                            labOption = new TblLabControlOption();
                        }
                        int Id = 0;
                        if (labOption != null)
                        {
                            Id = labOption.Id;
                        }
                        labOption = _mapper.Map<Sevices.MasterEntities.TblControlOption, TblLabControlOption>(mopt);

                        labOption.Id = Id;

                        labOption.CreatedBy = _httpContextAccessor.HttpContext.User.GetUserId();
                        labOption.CreatedDate = DateTime.UtcNow;
                        labOption.LabId = request.LabId;
                        labOption.IsDefaultSelected = ropt.isSelectedDefault;
                        labOption.IsVisible = ropt.isVisable;
                        if (!isOptionExist)
                            _applicationDbContext.TblLabControlOptions.Add(labOption);
                        else
                            _applicationDbContext.TblLabControlOptions.Update(labOption);
                        _applicationDbContext.SaveChanges();

                        if (ropt?.DependenceyControls != null && ropt?.DependenceyControls.Count > 0)
                        {

                            var dependencyDelete = _applicationDbContext.TblLabControlOptionDependencies.Where(x => x.ControlId == c.ControlId && x.OptionId == labOption.OptionId).ToList();
                            if (dependencyDelete.Count > 0)
                            {
                                _applicationDbContext.TblLabControlOptionDependencies.RemoveRange(dependencyDelete);

                                _applicationDbContext.SaveChanges();
                            }
                            foreach (var rdep in ropt.DependenceyControls)
                            {
                                var labdepCont = new TblLabControlOptionDependency();
                                labdepCont.ControlId = c.ControlId;
                                labdepCont.OptionId = labOption.OptionId;
                                labdepCont.DependentControlId = rdep.DependenceyControlID;
                                labdepCont.DependencyAction = rdep.DependenceyAction;
                                labdepCont.CreatedBy = _httpContextAccessor.HttpContext.User.GetUserId();
                                labdepCont.CreatedDate = DateTime.UtcNow;
                                labdepCont.LabId = request.LabId;
                                _applicationDbContext.TblLabControlOptionDependencies.Add(labdepCont);
                            }
                        }
                        _applicationDbContext.SaveChanges();

                    }

                }







                response.Message = "Request processed...";
                response.HttpStatusCode = Status.Success;


            }
            catch (Exception ex)
            {
                response.HttpStatusCode = Status.SomethingWentWrong;
                response.Error = ex.Message;

            }


            return response;
        }

        private TblLabRequisitionType SaveRequisitionType(SaveLabConfigurationRequestV2 req)
        {

            if (req.IsReqSection == 0)
                return new TblLabRequisitionType();

            var reqtype = _applicationDbContext.TblLabRequisitionTypes.FirstOrDefault(x => x.MasterRequisitionTypeId == req.ReqId);
            bool isReqExist = true;
            if (reqtype == null)
            {
                isReqExist = false;
                reqtype = new TblLabRequisitionType();
                reqtype.CreatedDate = DateTime.UtcNow;
                reqtype.CreatedBy = _httpContextAccessor.HttpContext.User.GetUserId();
            }
            reqtype.MasterRequisitionTypeId = req.ReqId;
            reqtype.RequisitionType = req.ReqName;
            reqtype.RequisitionTypeName = req.ReqDisplayName;
            reqtype.IsSelected = true;
            reqtype.LabId = Convert.ToInt32(req.LabId);
            reqtype.IsActive = true;

            reqtype.UpdatedDate = DateTime.UtcNow;
            reqtype.UpdatedBy = _httpContextAccessor.HttpContext.User.GetUserId();
            if (!isReqExist)
                _applicationDbContext.TblLabRequisitionTypes.Add(reqtype);
            _applicationDbContext.SaveChanges();
            return reqtype;

        }

        public RequestResponse SaveRequisitionTypeForClient(List<SaveRequisitionTypeViewModel> saveRequisitionTypes)
        {
            var response = new RequestResponse();
            var reqtypelst = _applicationDbContext.TblLabRequisitionTypes.ToList();
            var masterReqType = _dbContext.TblRequisitionTypes.ToList();
            foreach (var req in saveRequisitionTypes)
            {
                var reqtype = reqtypelst.FirstOrDefault(x => x.MasterRequisitionTypeId == req.ReqId);
                var masterReq = masterReqType.FirstOrDefault(x => x.ReqTypeId == req.ReqId);
                bool isReqExist = true;
                if (reqtype == null)
                {
                    isReqExist = false;
                    reqtype = new TblLabRequisitionType();
                    reqtype.CreatedDate = DateTime.UtcNow;
                    reqtype.CreatedBy = _httpContextAccessor.HttpContext.User.GetUserId();
                }
                reqtype.MasterRequisitionTypeId = req.ReqId == 0 ? masterReq?.ReqTypeId ?? 0 : req.ReqId;
                reqtype.RequisitionType = req.ReqName;
                reqtype.RequisitionColor = masterReq?.RequisitionColor;
                reqtype.RequisitionTypeName = req.ReqDisplayName;
                reqtype.IsSelected = req.IsSelected ?? false;
                reqtype.LabId = Convert.ToInt32(req.LabId);

                reqtype.IsActive = true;

                reqtype.UpdatedDate = DateTime.UtcNow;
                reqtype.UpdatedBy = _httpContextAccessor.HttpContext.User.GetUserId();
                if (!isReqExist)
                    _applicationDbContext.TblLabRequisitionTypes.Add(reqtype);
            }
            _applicationDbContext.SaveChanges();
            response.Message = "Request processed...";
            response.HttpStatusCode = Status.Success;

            return response;

        }


        private Sevices.MasterEntities.TblControlOption SaveMasterTblControlOption(SaveOptionV2 opt, TblLabSectionControl c, int sortorder)
        {
            var mo = _dbContext.TblControlOptions.FirstOrDefault(x => x.ControlId == c.ControlId && x.OptionValue == opt.Value);
            if (mo != null)
                return mo;
            mo = new Sevices.MasterEntities.TblControlOption();
            mo.ControlId = c.ControlId.Value;
            mo.OptionValue = opt.Value;
            mo.OptionName = opt.Label;
            mo.IsDefaultSelected = opt.isSelectedDefault;
            mo.CreatedBy = _httpContextAccessor.HttpContext.User.GetUserId();
            mo.CreatedDate = DateTime.UtcNow;
            mo.SortOrder = sortorder;
            mo.IsVisible = opt.isVisable;
            _dbContext.TblControlOptions.Add(mo);
            _dbContext.SaveChanges();

            return mo;
        }
        private TblLabControlOption SaveMasterTblControlOptionForClient(SaveOptionV2 opt, TblLabSectionControl c, int sortorder)
        {
            var mo = _applicationDbContext.TblLabControlOptions.FirstOrDefault(x => x.ControlId == c.ControlId && x.OptionValue == opt.Value);
            if (mo != null)
                return mo;
            mo = new TblLabControlOption();
            mo.ControlId = c.Id;
            mo.OptionId = opt.id;
            mo.OptionValue = opt.Value;
            mo.OptionName = opt.Name;
            mo.IsDefaultSelected = opt.isSelectedDefault;
            mo.CreatedBy = _httpContextAccessor.HttpContext.User.GetUserId();
            mo.CreatedDate = DateTime.UtcNow;
            mo.SortOrder = sortorder;
            mo.IsVisible = opt.isVisable;
            _applicationDbContext.TblLabControlOptions.Add(mo);
            _dbContext.SaveChanges();

            return mo;
        }

        public RequestResponse<List<ControlLookup>> ControlTypeLookup()
        {
            var response = new RequestResponse<List<ControlLookup>>();

            var result = _dbContext.TblControlTypes.Select(s => new ControlLookup()
            {
                UITypeId = s.ControlId,
                UITypeName = s.ControlName
            }).ToList();

            response.Data = result;
            response.HttpStatusCode = Status.Success;
            response.Message = "Request Processed...";

            return response;
        }
        public RequestResponse<List<ControlLookup>> PortalTypeLookup()
        {
            var response = new RequestResponse<List<ControlLookup>>();

            var result = _dbContext.TblOptionLookups.Where(w => w.UserType.ToUpper() == "PORTALTYPE" && w.IsActive.Equals(true)).Select(s => new ControlLookup()
            {
                UITypeId = s.Id,
                UITypeName = s.Name
            }).ToList();

            response.Data = result;
            response.HttpStatusCode = Status.Success;
            response.Message = "Request Processed...";

            return response;
        }
        public RequestResponse<List<ReqSectionResponseViewModel>> GetAllReqSections(ReqSectionsViewModel request)
        {
            List<ReqSectionResponseViewModel> reqSection = new List<ReqSectionResponseViewModel>();
            var reqtypelst = _dbContext.TblRequisitionTypes.AsNoTracking().Where(x => x.IsDeleted != true).Select(x => new ReqSectionResponseViewModel
            {
                Id = x.ReqTypeId,
                ReqDisplayName = x.RequisitionTypeName,
                ReqName = x.RequisitionType,
                isSelected = false,
                Color = x.RequisitionColor ?? ""
            }).ToList();

            var selectedLabReqLst = _applicationDbContext.TblLabRequisitionTypes.AsNoTracking().Where(x => x.IsActive == true && x.IsDeleted != true && x.IsSelected == true).ToList();
            foreach (var req in reqtypelst)
            {
                var labReqSelection = selectedLabReqLst.FirstOrDefault(x => x.MasterRequisitionTypeId == req.Id);
                //if (labReqSelection == null)
                //    continue;
                req.ReqDisplayName = string.IsNullOrEmpty(labReqSelection?.RequisitionTypeName) ? req.ReqDisplayName : labReqSelection.RequisitionTypeName;
                req.isSelected = (labReqSelection?.IsSelected == null || labReqSelection.IsSelected == false) ? req.isSelected : labReqSelection.IsSelected;
                req.Color = string.IsNullOrEmpty(labReqSelection?.RequisitionColor) ? req.Color : labReqSelection?.RequisitionColor ?? "";
                req.Sections = new List<SectionWithControlsAndDependencies>();
                req.Sections = LoadSystemFieldsOfSectionForAdmin(request.PageID, req.Id);
                reqSection.Add(req);
            }


            RequestResponse<List<ReqSectionResponseViewModel>> resp = new RequestResponse<List<ReqSectionResponseViewModel>>();

            resp.HttpStatusCode = Status.Success;
            resp.Message = "Data loaded successfully";
            resp.Data = reqSection;
            return resp;
        }
        public RequestResponse<ReqSectionResponseViewModel> GetAllCommonSections(ReqSectionsViewModel request)
        {
            ReqSectionResponseViewModel req = new ReqSectionResponseViewModel();
            //    continue;
            req.ReqDisplayName = "";
            req.Id = 0;
            req.isSelected = true;
            req.ReqName = "";
            req.Color = "";
            req.Sections = new List<SectionWithControlsAndDependencies>();
            req.Sections = LoadSystemFieldsOfSectionForAdmin(request.PageID, 0);



            RequestResponse<ReqSectionResponseViewModel> resp = new RequestResponse<ReqSectionResponseViewModel>();

            resp.HttpStatusCode = Status.Success;
            resp.Message = "Data loaded successfully";
            resp.Data = req;
            return resp;
        }
        public List<SectionWithControlsAndDependencies> LoadSystemFieldsOfSectionForAdmin(int pageId, int ReqType)
        {
            var response = new RequestResponse<List<SectionWithControlsAndDependencies>>();

            var allPageSections = new List<SectionWithControlsAndDependencies>();
            var allLabSections = _applicationDbContext.TblLabPageSections.Where(x => x.PageId == pageId && x.IsReqSection == ReqType).AsNoTracking().ToList();
            var allLabSectionsIdslst = allLabSections.Select(x => x.SectionId).ToList();

            var allLabControls = _applicationDbContext.TblLabSectionControls.Where(x => allLabSectionsIdslst.Contains(x.SectionId)).AsNoTracking().ToList();
            //==========================================================================
            var controlsNameFromMasterDb = _dbContext.TblControls.ToList();

            allLabControls.ForEach(labControl =>
            {
                var correspondingControl = controlsNameFromMasterDb
                    .FirstOrDefault(c => c.Id == labControl.ControlId);

                if (correspondingControl != null)
                {
                    labControl.ControlKey = correspondingControl.ControlKey;
                    // You can update other properties as needed
                }
            });
            //================================================================================
            var tblPageSectionInfos = _dbContext.TblPageSections.Where(f => f.PageId == pageId && f.IsReqSection == ReqType).AsNoTracking().ToList();
            var allSectionsIds = tblPageSectionInfos.Select(x => x.SectionId).ToList();

            var tblSectionsInfos = _dbContext.TblSections.Where(x => allSectionsIds.Contains(x.Id)).AsNoTracking().ToList();

            var tblsectionControls = _dbContext.TblSectionControls.Where(x => allSectionsIds.Contains(x.SectionId.Value)).AsNoTracking().ToList();


            var allControlsIdslst = tblsectionControls.Select(x => x.ControlId).ToList();
            var allControlOptions = _dbContext.TblControlOptions.AsNoTracking().ToList();
            var allDepedencyControlOPtion = _dbContext.TblControlOptionDependencies.AsNoTracking().ToList();
            var allLabControlOptions = _applicationDbContext.TblLabControlOptions.AsNoTracking().ToList();
            var TblLabControlPortalTypes = _applicationDbContext.TblLabControlPortalTypes.AsNoTracking().ToList();
            var allLabDepedencyControlOPtion = _applicationDbContext.TblLabControlOptionDependencies.AsNoTracking().ToList();
            var allControls = _dbContext.TblControls.Where(x => allControlsIdslst.Contains(x.Id)).AsNoTracking().Select(x => new TrueMed.Sevices.MasterEntities.TblControl()
            {
                ControlKey = x.ControlKey,
                ControlName = x.ControlName,
                DisplayType = x.DisplayType,
                IsSystemRequired = x.IsSystemRequired,
                CssStyle = x.CssStyle,
                Id = x.Id,
                IsActive = x.IsActive,
                DefaultValue = x.DefaultValue,
                SortOrder = x.SortOrder,
                TypeOfControl = x.TypeOfControl ?? 200000,// issue
                TypeOfSection = x.TypeOfSection,
                Options = x.Options

            }).ToList();
            var AlltblControlTypeInfo = _dbContext.TblControlTypes.ToList();
            foreach (var section in tblPageSectionInfos)
            {
                #region Section
                var isSectionExist = allPageSections.Any(x => x.SectionId == section.SectionId);
                if (isSectionExist)
                    continue;

                var SectionInfo = tblSectionsInfos.FirstOrDefault(x => x.Id == section.SectionId);

                if (string.IsNullOrEmpty(SectionInfo?.SectionName))
                    continue;
                var labSection = allLabSections.FirstOrDefault(x => x.SectionId == section.SectionId);

                var sectionWithControls = new SectionWithControlsAndDependencies();

                sectionWithControls.SectionName = SectionInfo?.SectionName;
                sectionWithControls.SectionId = section?.SectionId ?? 0;
                sectionWithControls.PageId = pageId;
                sectionWithControls.IsSelected = labSection?.IsSelected ?? false;
                sectionWithControls.SortOrder = labSection?.SortOrder != null ? labSection?.SortOrder : SectionInfo?.Order ?? 10000;
                sectionWithControls.DisplayType = !string.IsNullOrEmpty(labSection?.DisplayType) ? labSection?.DisplayType : SectionInfo?.DisplayType;
                sectionWithControls.CustomScript = !string.IsNullOrEmpty(labSection?.CustomScript) ? labSection?.CustomScript : "";
                sectionWithControls.CssStyle = !string.IsNullOrEmpty(labSection?.CssStyle) ? labSection?.CssStyle : "";






                #endregion
                sectionWithControls.Fields = new List<ControlWithDependencies>();



                var AllfieldsOfSectionIDslst = tblsectionControls.Where(x => x.SectionId == section.SectionId)
                                                .Select(x => x.ControlId)
                                                .ToList();

                if (AllfieldsOfSectionIDslst.Count == 0)
                    continue;


                //  var allSectionControls = allControls.Where(x => AllfieldsOfSectionIDslst.Contains(x.Id)).ToList();
                var allSectionControls = allControls.Where(x => AllfieldsOfSectionIDslst.Contains(x.Id)).ToList();

                if (allSectionControls.Count == 0)
                    continue;
                foreach (var f in allSectionControls)
                {

                    var p = TblLabControlPortalTypes.Where(w => w.ControlId == f.Id).Select(s=> s.PortalTypeId).ToList();

                    ControlWithDependencies c = GetControlWithDependenciesForMaster(f, allLabControls,
                        allControlOptions, allControls, allDepedencyControlOPtion,
                        AlltblControlTypeInfo, true, allLabControlOptions, allLabDepedencyControlOPtion, section?.SectionId,false,p);

                    sectionWithControls.Fields.Add(c);


                }
                sectionWithControls.Fields = sectionWithControls.Fields.OrderBy(x => x.SortOrder).ToList();
                allPageSections.Add(sectionWithControls);


            }




            return allPageSections;
        }

        public RequestResponse<List<ReqSectionResponseViewModel>> GetAllReqSectionsForClient(ReqSectionsViewModel request)
        {
            List<ReqSectionResponseViewModel> reqSection = new List<ReqSectionResponseViewModel>();
            var reqtypelst = _dbContext.TblRequisitionTypes.AsNoTracking().Where(x => x.IsDeleted != true).Select(x => new ReqSectionResponseViewModel
            {
                Id = x.ReqTypeId,
                ReqDisplayName = x.RequisitionTypeName,
                ReqName = x.RequisitionType,
                isSelected = false,
                Color = x.RequisitionColor ?? ""
            }).ToList();

            var selectedLabReqLst = _applicationDbContext.TblLabRequisitionTypes.AsNoTracking().Where(x => x.IsActive == true && x.IsDeleted != true && x.IsSelected == true).ToList();
            foreach (var req in reqtypelst)
            {
                var labReqSelection = selectedLabReqLst.FirstOrDefault(x => x.MasterRequisitionTypeId == req.Id);
                //if (labReqSelection == null)
                //    continue;
                req.ReqDisplayName = string.IsNullOrEmpty(labReqSelection?.RequisitionTypeName) ? req.ReqDisplayName : labReqSelection.RequisitionTypeName;
                req.isSelected = (labReqSelection?.IsSelected == null || labReqSelection.IsSelected == false) ? req.isSelected : labReqSelection.IsSelected;
                req.Color = string.IsNullOrEmpty(labReqSelection?.RequisitionColor) ? req.Color : labReqSelection?.RequisitionColor ?? "";
                req.Sections = new List<SectionWithControlsAndDependencies>();
                req.Sections = LoadSystemFieldsOfSectionForClient(request.PageID, req.Id);
                reqSection.Add(req);
            }


            RequestResponse<List<ReqSectionResponseViewModel>> resp = new RequestResponse<List<ReqSectionResponseViewModel>>();

            resp.HttpStatusCode = Status.Success;
            resp.Message = "Data loaded successfully";
            resp.Data = reqSection;
            return resp;
        }

        public List<SectionWithControlsAndDependencies> LoadSystemFieldsOfSectionForClient(int pageId, int ReqType)
        {
            var response = new RequestResponse<List<SectionWithControlsAndDependencies>>();

            var allPageSections = new List<SectionWithControlsAndDependencies>();
            var allLabSections = _applicationDbContext.TblLabPageSections.Where(x => x.PageId == pageId && x.IsReqSection == ReqType).AsNoTracking().ToList();
            var allLabSectionsIdslst = allLabSections.Select(x => x.SectionId).ToList();

            var allLabControls = _applicationDbContext.TblLabSectionControls.Where(x => allLabSectionsIdslst.Contains(x.SectionId)).AsNoTracking().ToList();


            var tblPageSectionInfos = _dbContext.TblPageSections.Where(f => f.PageId == pageId && f.IsReqSection == ReqType).AsNoTracking().ToList();
            var allSectionsIds = tblPageSectionInfos.Select(x => x.SectionId).ToList();

            var tblSectionsInfos = _dbContext.TblSections.Where(x => allSectionsIds.Contains(x.Id)).AsNoTracking().ToList();

            var tblsectionControls = _dbContext.TblSectionControls.Where(x => allSectionsIds.Contains(x.SectionId.Value)).AsNoTracking().ToList();


            var allControlsIdslst = tblsectionControls.Select(x => x.ControlId).ToList();
            var allControlOptions = _dbContext.TblControlOptions.AsNoTracking().ToList();
            var allDepedencyControlOPtion = _dbContext.TblControlOptionDependencies.AsNoTracking().ToList();
            var allLabControlOptions = _applicationDbContext.TblLabControlOptions.AsNoTracking().ToList();
            var allLabDepedencyControlOPtion = _applicationDbContext.TblLabControlOptionDependencies.AsNoTracking().ToList();
            var allControls = _dbContext.TblControls.Where(x => allControlsIdslst.Contains(x.Id)).AsNoTracking().Select(x => new TrueMed.Sevices.MasterEntities.TblControl()
            {
                ControlKey = x.ControlKey,
                ControlName = x.ControlName,
                DisplayType = x.DisplayType,
                IsSystemRequired = x.IsSystemRequired,
                CssStyle = x.CssStyle,
                Id = x.Id,
                IsActive = x.IsActive,
                DefaultValue = x.DefaultValue,
                SortOrder = x.SortOrder,
                TypeOfControl = x.TypeOfControl ?? 200000,// issue
                TypeOfSection = x.TypeOfSection,
                Options = x.Options

            }).ToList();
            var AlltblControlTypeInfo = _dbContext.TblControlTypes.ToList();
            foreach (var section in tblPageSectionInfos)
            {
                #region Section
                var isSectionExist = allPageSections.Any(x => x.SectionId == section.SectionId);
                if (isSectionExist)
                    continue;

                var SectionInfo = tblSectionsInfos.FirstOrDefault(x => x.Id == section.SectionId);

                if (string.IsNullOrEmpty(SectionInfo?.SectionName))
                    continue;
                var labSection = allLabSections.FirstOrDefault(x => x.SectionId == section.SectionId);

                var sectionWithControls = new SectionWithControlsAndDependencies();

                sectionWithControls.SectionName = SectionInfo?.SectionName;
                sectionWithControls.SectionId = section?.SectionId ?? 0;
                sectionWithControls.PageId = pageId;
                sectionWithControls.IsSelected = labSection?.IsSelected ?? false;
                sectionWithControls.SortOrder = labSection?.SortOrder != null ? labSection?.SortOrder : SectionInfo?.Order ?? 10000;
                sectionWithControls.DisplayType = !string.IsNullOrEmpty(labSection?.DisplayType) ? labSection?.DisplayType : SectionInfo?.DisplayType;
                sectionWithControls.CustomScript = !string.IsNullOrEmpty(labSection?.CustomScript) ? labSection?.CustomScript : "";
                sectionWithControls.CssStyle = !string.IsNullOrEmpty(labSection?.CssStyle) ? labSection?.CssStyle : "";






                #endregion
                sectionWithControls.Fields = new List<ControlWithDependencies>();



                var AllfieldsOfSectionIDslst = tblsectionControls.Where(x => x.SectionId == section.SectionId)
                                                .Select(x => x.ControlId)
                                                .ToList();

                if (AllfieldsOfSectionIDslst.Count == 0)
                    continue;


                //  var allSectionControls = allControls.Where(x => AllfieldsOfSectionIDslst.Contains(x.Id)).ToList();
                var allSectionControls = allControls.Where(x => AllfieldsOfSectionIDslst.Contains(x.Id)).ToList();

                if (allSectionControls.Count == 0)
                    continue;
                foreach (var f in allSectionControls)
                {



                    ControlWithDependencies c = GetControlWithDependenciesForMaster(f, allLabControls,
                        allControlOptions, allControls, allDepedencyControlOPtion,
                        AlltblControlTypeInfo, true, allLabControlOptions, allLabDepedencyControlOPtion, section?.SectionId);

                    sectionWithControls.Fields.Add(c);


                }
                sectionWithControls.Fields = sectionWithControls.Fields.OrderBy(x => x.SortOrder).ToList();
                allPageSections.Add(sectionWithControls);


            }




            return allPageSections;
        }

        public List<SectionWithControlsAndDependenciesClient> LoadReqSectionsForClient(int pageId)
        {

            var allPageSections = new List<SectionWithControlsAndDependenciesClient>();
            var allLabSections = _applicationDbContext.TblLabPageSections.Where(x => x.PageId == pageId && x.IsReqSection == 0).AsNoTracking().ToList();
            var allLabSectionsIdslst = allLabSections.Select(x => x.SectionId).ToList();

            var allLabControls = _applicationDbContext.TblLabSectionControls.Where(x => allLabSectionsIdslst.Contains(x.SectionId)).AsNoTracking().ToList();


            var tblPageSectionInfos = _dbContext.TblPageSections.Where(f => f.PageId == pageId).AsNoTracking().ToList();
            var allSectionsIds = tblPageSectionInfos.Select(x => x.SectionId).ToList();

            var tblSectionsInfos = _dbContext.TblSections.Where(x => allSectionsIds.Contains(x.Id)).AsNoTracking().ToList();

            var tblsectionControls = _dbContext.TblSectionControls.Where(x => allSectionsIds.Contains(x.SectionId.Value)).AsNoTracking().ToList();


            var allControlsIdslst = tblsectionControls.Select(x => x.ControlId).ToList();
            var allControlOptions = _dbContext.TblControlOptions.AsNoTracking().ToList();
            var allDepedencyControlOPtion = _dbContext.TblControlOptionDependencies.AsNoTracking().ToList();

            var allControls = _dbContext.TblControls.Where(x => allControlsIdslst.Contains(x.Id)).AsNoTracking().Select(x => new TrueMed.Sevices.MasterEntities.TblControl()
            {
                ControlKey = x.ControlKey,
                ControlName = x.ControlName,
                DisplayType = x.DisplayType,
                IsSystemRequired = x.IsSystemRequired,
                CssStyle = x.CssStyle,
                Id = x.Id,
                IsActive = x.IsActive,
                DefaultValue = x.DefaultValue,
                SortOrder = x.SortOrder,
                TypeOfControl = x.TypeOfControl ?? 200000,// issue
                TypeOfSection = x.TypeOfSection,
                Options = x.Options
            }).ToList();
            var AlltblControlTypeInfo = _dbContext.TblControlTypes.ToList();
            var allLabControlOptions = _applicationDbContext.TblLabControlOptions.AsNoTracking().ToList();
            var allLabDepedencyControlOPtion = _applicationDbContext.TblLabControlOptionDependencies.AsNoTracking().ToList();

            foreach (var labSection in allLabSections)
            {
                #region Section
                var isSectionExist = allPageSections.Any(x => x.SectionId == labSection.SectionId);
                if (isSectionExist)
                    continue;

                var section = tblPageSectionInfos.FirstOrDefault(x => x.SectionId == labSection.SectionId);
                if (string.IsNullOrEmpty(labSection?.SectionName))
                    continue;


                var sectionWithControls = new SectionWithControlsAndDependenciesClient();

                sectionWithControls.SectionName = labSection?.SectionName;
                sectionWithControls.SectionId = labSection?.SectionId ?? 0;
                sectionWithControls.PageId = pageId;
                sectionWithControls.IsSelected = labSection?.IsSelected ?? false;
                sectionWithControls.SortOrder = labSection?.SortOrder != null ? labSection?.SortOrder : section?.Section?.Order ?? 10000;
                sectionWithControls.DisplayType = string.IsNullOrEmpty(labSection?.DisplayType) ? "col-lg-6 col-md-6 col-sm-12" : labSection?.DisplayType ?? "";
                sectionWithControls.CssStyle = string.IsNullOrEmpty(labSection?.CssStyle ?? "") ? "" : labSection?.CssStyle ?? "";
                sectionWithControls.CustomScript = string.IsNullOrEmpty(labSection.CustomScript ?? "") ? "" : labSection.CustomScript ?? "";
                #endregion
                sectionWithControls.Fields = new List<ControlWithDependenciesClient>();
                sectionWithControls.DependencyControls = new List<DependencyControlsClient>();


                var AllfieldsOfSectionIDslst = allLabControls.Where(x => x.SectionId == labSection.SectionId)
                                                .Select(x => x.ControlId)
                                                .ToList();

                if (AllfieldsOfSectionIDslst.Count == 0)
                {
                    allPageSections.Add(sectionWithControls);
                    continue;
                }

                //  var allSectionControls = allControls.Where(x => AllfieldsOfSectionIDslst.Contains(x.Id)).ToList();
                var allSectionControls = allControls.Where(x => AllfieldsOfSectionIDslst.Contains(x.Id)).OrderBy(x => x.SortOrder).ToList();

                if (allSectionControls.Count == 0)
                    continue;


                bool isRepeateControl = false;
                var rc = new ControlWithDependenciesClient();
                rc.RepeatFields = new List<ControlWithDependenciesClient>();
                rc.RepeatDependencyControls = new List<DependencyControlsClient>();
                foreach (var f in allSectionControls)
                {
                    if (f.TypeOfControl == 25)// Repeat Start
                    {
                        rc = new ControlWithDependenciesClient();
                        rc.RepeatFields = new List<ControlWithDependenciesClient>();
                        rc.RepeatDependencyControls = new List<DependencyControlsClient>();
                        rc.UIType = "Repeat";
                        rc.SortOrder = f.SortOrder;
                        rc.DisplayFieldName = f.ControlName;
                        rc.Visible = true;
                        isRepeateControl = true;
                        continue;
                    }
                    if (f.TypeOfControl == 26)// Repeat End
                    {
                        rc.RepeatFields = rc.RepeatFields.OrderBy(x => x.SortOrder).ToList();
                        sectionWithControls.Fields.Add(rc);
                        isRepeateControl = false;
                        continue;
                    }
                    var controlsAndDependent = GetControlWithDependenciesforClient(f, allLabControls,
                            allControlOptions, allControls, allDepedencyControlOPtion,
                            AlltblControlTypeInfo, false, allLabControlOptions, allLabDepedencyControlOPtion, "", sectionWithControls.SectionId);


                    if (!isRepeateControl)
                    {

                        sectionWithControls.Fields.Add(controlsAndDependent.Fields);
                        sectionWithControls.DependencyControls.AddRange(controlsAndDependent.DependencyControls.ToList());
                    }
                    else
                    {
                        rc.RepeatFields.Add(controlsAndDependent.Fields);
                        rc.RepeatDependencyControls.AddRange(controlsAndDependent.DependencyControls.ToList());

                    }
                }





                sectionWithControls.Fields = sectionWithControls.Fields.OrderBy(x => x.SortOrder).ToList();
                allPageSections.Add(sectionWithControls);


            }
            // Removing duplicates from dependencies
            foreach (var section in allPageSections)
            {
                var allvisableFields = section.Fields.Where(x => x.Visible == true).ToList();
                var controlsId = section.Fields.Where(x => x.Visible == true).Select(x => x.ControlId).ToList();
                section.Fields = new List<ControlWithDependenciesClient>();
                section.Fields = allvisableFields.ToList();
                foreach (var fd in section.DependencyControls)
                {
                    var uniqueContlst = fd.DependecyFields.Where(x => !controlsId.Contains(x.ControlId)).ToList();
                    fd.DependecyFields = new List<ControlWithDependenciesClient>();
                    fd.DependecyFields.AddRange(uniqueContlst);
                }
            }

            return allPageSections.OrderBy(x => x.SortOrder).ToList();

        }

        public List<SectionWithControlsAndDependenciesClient> LoadReqSectionsForClient(ReqSectionsViewModel request)
        {

            //var facilityAssignments = _applicationDbContext.TblLabFacInsAssignments
            //    .Where(x => x.FacilityId == request.FacilityID).
            //    AsNoTracking().ToList();
            return new List<SectionWithControlsAndDependenciesClient>();

        }
        public async Task<List<CommonLookupResponse>> GetPortalTypesLookup()
        {
            return await _dbContext.TblOptionLookups.Where(f => f.UserType.ToUpper().Trim() == "PORTALTYPE" && f.IsActive.Equals(true)).Select(s => new CommonLookupResponse()
            {
                Value = s.Id,
                Label = s.Name

            }).ToListAsync();
        }
    }
}
