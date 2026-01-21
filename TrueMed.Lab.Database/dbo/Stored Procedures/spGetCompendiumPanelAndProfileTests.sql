-- =============================================
-- Author:      <Author, , Name>
-- Create Date: <Create Date, , >
-- Description: <Description, , >
-- =============================================
CREATE PROCEDURE [dbo].[spGetCompendiumPanelAndProfileTests]
(
@OperationName nvarchar(max),
@ID int
)
AS
BEGIN
  IF(@OperationName='ALLPanelTests')
  BEGIN
  Select cpa.ChildPanelID as ID,'Profile' as Type, CONCAT(cpa.PanelDisplayName,' (Profile)') as TestDisplayName  from tblCompendiumPanels cp
   inner join tblCompendiumPanelAssignments cpa on cp.ID=cpa.ParentPanelID and cpa.ChildPanelID!=cp.ID --and ISNULL(cpa.IsGroupTest,0)=0
    union 
    Select ctc.TestID as ID,'Test' as Type, ctc.TestDisplayName from tblCompendiumPanels cp
    inner join tblCompendiumPanelAssignments cpa on cp.ID=cpa.ParentPanelID and cpa.ChildPanelID=cp.ID --and ISNULL(cpa.IsGroupTest,0)=0
    Inner join  tblCompendiumPanelTestAssignments cpt on cpt.PanelID=cpa.ChildPanelID
    inner Join tblCompendiumTestConfigurations ctc on cpt.TestConfigID=ctc.ID

  END
 ELSE IF(@OperationName='AllPanelTestsByPanelID')
  BEGIN
  Select cpa.ChildPanelID as ID,'Profile' as Type, CONCAT(cpa.PanelDisplayName,' (Profile)') as TestDisplayName  from tblCompendiumPanels cp
inner join tblCompendiumPanelAssignments cpa on cp.ID=cpa.ParentPanelID and cpa.ChildPanelID!=cp.ID --and ISNULL(cpa.IsGroupTest,0)=0
union 
Select ctc.TestID as ID,'Test' as Type, ctc.TestDisplayName from tblCompendiumPanels cp
inner join tblCompendiumPanelAssignments cpa on cp.ID=cpa.ParentPanelID and cpa.ChildPanelID=cp.ID --and ISNULL(cpa.IsGroupTest,0)=0
Inner join  tblCompendiumPanelTestAssignments cpt on cpt.PanelID=cpa.ChildPanelID
inner Join tblCompendiumTestConfigurations ctc on cpt.TestConfigID=ctc.ID
Where cp.ID=@ID



END
ELSE IF(@OperationName='AllPanelTestsByPerformingLab')
  BEGIN
  Select cpa.ChildPanelID as ID,'Profile' as Type, CONCAT(cpa.PanelDisplayName,' (Profile)') as TestDisplayName  from tblCompendiumPanels cp
inner join tblCompendiumPanelAssignments cpa on cp.ID=cpa.ParentPanelID and cpa.ChildPanelID!=cp.ID --and ISNULL(cpa.IsGroupTest,0)=0
Where cpa.ReferenceLabID=@ID
union 
Select ctc.TestID as ID,'Test' as Type, ctc.TestDisplayName from tblCompendiumPanels cp
inner join tblCompendiumPanelAssignments cpa on cp.ID=cpa.ParentPanelID and cpa.ChildPanelID=cp.ID --and ISNULL(cpa.IsGroupTest,0)=0
Inner join  tblCompendiumPanelTestAssignments cpt on cpt.PanelID=cpa.ChildPanelID
inner Join tblCompendiumTestConfigurations ctc on cpt.TestConfigID=ctc.ID
Where ctc.ReferenceLabID=@ID



END




END
