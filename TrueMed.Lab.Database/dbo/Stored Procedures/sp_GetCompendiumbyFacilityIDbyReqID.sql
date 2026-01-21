CREATE procedure [dbo].[sp_GetCompendiumbyFacilityIDbyReqID]
@FacilityId int,
@ReqTypeId int
as begin

--select * from tblLabRequisitionType
select  tcgpa.PanelID, tcgpa.PanelDisplayName as PanelName,tct.ID as TestID, tctc.TestDisplayName as TestName,tctc.TestCode
from 
(select ID, ProfileName, RefLabID, ReqTypeID from tblLabAssignment where ISNULL(IsActive,0)=1 and ISNULL(IsDeleted,0)=0) tblLA join

(select FacilityID,LabAssignmentID from [tblFacilityRefLabAssignment] where ISNULL(IsActive,0)=1 and ISNULL(IsDeleted,0)=0)  tfrla
on tblLA.ID=tfrla.LabAssignmentID
join
(select LabAssignmentID,GroupID from tblLabAssignmentGroups) tblLAG on tblLA.ID=tblLAG.LabAssignmentID
join
(select PanelID,PanelDisplayName,GroupID from [tblCompendiumGroupPanelsAssignment] where ISNULL(IsActive,0)=1 and ISNULL(IsDeleted,0)=0) tcgpa on tblLAG.GroupID=tcgpa.GroupID join 
(select PanelID,TestConfigID,TestID from [tblCompendiumPanelTestAssignments] where ISNULL(IsActive,0)=1 and ISNULL(IsDeleted,0)=0) tcpta on tcgpa.PanelID=tcpta.PanelID join
(select ID, TestID, TestDisplayName,TestCode from tblCompendiumTestConfigurations where ISNULL(IsActive,0)=1 and ISNULL(IsDeleted,0)=0) tctc on  tcpta.TestConfigID=tctc.ID join
(select ID from [tblCompendiumTests] where ISNULL(IsActive,0)=1 and ISNULL(IsDeleted,0)=0) tct on tcpta.TestID=tct.ID and tctc.TestID=tct.ID
where tfrla.FacilityID=@FacilityId and tblLA.ReqTypeID=@ReqTypeId
end