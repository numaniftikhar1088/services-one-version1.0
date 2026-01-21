SET IDENTITY_INSERT [dbo].[tblApplicationLinks] ON
MERGE [dbo].[tblApplicationLinks] AS T
USING 
(
    VALUES 
	(1,3,'Add a Facility','/api/Facility/UpsertFacility',1,0),
	(2,3,'Manage Facility','/api/Facility/Facilities',1,0),
	(3,3,'Manage Patient','/api/PatientManagement/GetAll',1,0)

) AS S(Id, PageId,PermissionName,PermissionLink, ModuleId, IsPublic) ON T.Id = S.Id
WHEN NOT MATCHED BY TARGET THEN
INSERT (Id,PageId,PermissionName,PermissionLink,ModuleId,IsPublic)
VALUES (S.Id,S.PageId,S.PermissionName,S.PermissionLink,S.ModuleId,S.IsPublic)
WHEN MATCHED AND S.IsPublic = T.IsPublic THEN UPDATE SET
T.PageId             = S.PageId,
T.PermissionName     = S.PermissionName,
T.PermissionLink     = S.PermissionLink,
T.ModuleId           = S.ModuleId, 
T.IsPublic           = S.IsPublic
WHEN NOT MATCHED BY SOURCE THEN
DELETE;
SET IDENTITY_INSERT [dbo].[tblApplicationLinks] OFF