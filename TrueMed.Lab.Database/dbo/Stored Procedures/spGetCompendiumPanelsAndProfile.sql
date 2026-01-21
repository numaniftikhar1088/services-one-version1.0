-- =============================================
-- Author:      <Author, , Name>
-- Create Date: <Create Date, , >
-- Description: <Description, , >
-- =============================================
CREATE PROCEDURE [dbo].[spGetCompendiumPanelsAndProfile]
(
  @OperationName varchar(max),
  @ReqTypeID int

)
AS
BEGIN
IF(@OperationName='ALLPanels')
BEGIN
Select cp.ID as PanelID,cpa.ID as PanelAssignmentID,cp.PanelName,rt.RequisitionTypeName,cp.TMITCode,dp.DepartmentName,dp.DeptID from tblCompendiumPanels cp
inner join tblCompendiumPanelAssignments cpa on cp.ID=cpa.ParentPanelID and cpa.ChildPanelID=cp.ID --and ISNULL(cpa.IsGroupTest,0)=0
inner join tblRequisitionType rt on cp.ReqTypeID=rt.ReqTypeID
inner join tblCompendiumPanelDepartmentAssignments pda on pda.PanelID=cp.ID
inner join tblDepartment dp on pda.DepartmentID =dp.DeptID
inner Join tblCompendiumGroupPanelsAssignment cga on cga.PanelID=cp.ID
inner join tblCompendiumGroups cg on cg.ID=cga.GroupID 

END
ELSE IF(@OperationName='ALLPanelsByReqTypeID')
  BEGIN
Select cp.ID as PanelID,cpa.ID as PanelAssignmentID,cp.PanelName,rt.RequisitionTypeName,cp.TMITCode,dp.DepartmentName,dp.DeptID from tblCompendiumPanels cp
inner join tblCompendiumPanelAssignments cpa on cp.ID=cpa.ParentPanelID and cpa.ChildPanelID=cp.ID --and ISNULL(cpa.IsGroupTest,0)=0
inner join tblRequisitionType rt on cp.ReqTypeID=rt.ReqTypeID
inner join tblCompendiumPanelDepartmentAssignments pda on pda.PanelID=cp.ID
inner join tblDepartment dp on pda.DepartmentID =dp.DeptID
inner Join tblCompendiumGroupPanelsAssignment cga on cga.PanelID=cp.ID
inner join tblCompendiumGroups cg on cg.ID=cga.GroupID where cp.ReqTypeID=@ReqTypeID

END  

ELSE IF(@OperationName='ALLProfiles')
BEGIN
Select cp.ID as PanelID,cpa.ID as PanelAssignmentID,cp.PanelName,rt.RequisitionTypeName,cp.TMITCode,dp.DepartmentName,dp.DeptID from tblCompendiumPanels cp
inner join tblCompendiumPanelAssignments cpa on cp.ID=cpa.ParentPanelID and cpa.ChildPanelID=cp.ID --and ISNULL(cpa.IsGroupTest,0)=1
inner join tblRequisitionType rt on cp.ReqTypeID=rt.ReqTypeID
inner join tblCompendiumPanelDepartmentAssignments pda on pda.PanelID=cp.ID
inner join tblDepartment dp on pda.DepartmentID =dp.DeptID
inner Join tblCompendiumGroupPanelsAssignment cga on cga.PanelID=cp.ID
inner join tblCompendiumGroups cg on cg.ID=cga.GroupID 

END
ELSE IF(@OperationName='ALLProfilesByReqTypeID')
  BEGIN
Select cp.ID as PanelID,cpa.ID as PanelAssignmentID,cp.PanelName,rt.RequisitionTypeName,cp.TMITCode,dp.DepartmentName,dp.DeptID from tblCompendiumPanels cp
inner join tblCompendiumPanelAssignments cpa on cp.ID=cpa.ParentPanelID and cpa.ChildPanelID=cp.ID --and ISNULL(cpa.IsGroupTest,0)=1
inner join tblRequisitionType rt on cp.ReqTypeID=rt.ReqTypeID
inner join tblCompendiumPanelDepartmentAssignments pda on pda.PanelID=cp.ID
inner join tblDepartment dp on pda.DepartmentID =dp.DeptID
inner Join tblCompendiumGroupPanelsAssignment cga on cga.PanelID=cp.ID
inner join tblCompendiumGroups cg on cg.ID=cga.GroupID where cp.ReqTypeID=@ReqTypeID

END  





END
