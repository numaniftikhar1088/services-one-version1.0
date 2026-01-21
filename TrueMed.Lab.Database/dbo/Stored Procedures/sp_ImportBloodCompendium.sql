Create Proc sp_ImportBloodCompendium 
As 
Begin


Insert Into [tblCompendiumPanels] (PanelName,ReqTypeID,Department,isActive,IsDeleted,CreatedBy,CreatedDate)

Select distinct PanelName, 1, 6, 1, 0, 'Stored Procedure', GETDATE() 
from [tblComepndiumBloodPanelMappingImport] t
where (Select Count(*)
       from [tblCompendiumPanels] c
	   where c.PanelName = t.PanelName
	   and c.ReqTypeID = 1
	   and c.isActive = 1
       ) = 0

Union 

Select distinct TestName, 1, 6, 1, 0, 'Stored Procedure', GETDATE() 
from [tblComepndiumBloodPanelMappingImport] t
where (Select Count(*)
       from [tblCompendiumPanels] c
	   where c.PanelName = t.TestName
	   and c.ReqTypeID = 1
	   and c.isActive = 1
       ) = 0
and t.TestType = 'Group'


Insert Into [tblCompendiumPanels] (PanelName,ReqTypeID,Department,isActive,IsDeleted,CreatedBy,CreatedDate)
Select distinct TestName, 1, 6, 1, 0, 'Stored Procedure', GETDATE() 
from [tblCompendiumBloodGroupTestAssignmentImport] ti
where (Select Count(*)
       from [tblCompendiumPanels] tc
	   where tc.PanelName = ti.TestName
	   and tc.ReqTypeID = 1
	   and tc.isActive = 1
	   ) = 0


Update t
set t.TMITCode = [dbo].[Fn_GenerateTmitTestCodeByPanelId](ID)
---Select [dbo].[Fn_GenerateTmitTestCodeByPanelId](ID), ID
from [tblCompendiumPanels] t
where ISNULL(TMITCode, '') = ''




Insert Into [tblCompendiumPanelAssignments] (ParentPanelID, ChildPanelID, PanelDisplayName, OrderingMethod, RequsitionDispalyType, ReferenceLabID, OrderCode, PanelTypeId, IsActive,
                                             IsDeleted, CreatedBy, CreatedDate)


Select distinct (Select c.ID from [tblCompendiumPanels] c where c.PanelName = t.PanelName), (Select c.ID from [tblCompendiumPanels] c where c.PanelName = t.TestName), t.PanelName,
t.OrderMethod, 'Blood', (Select tl.LabId from [tblLabs] tl where tl.LaboratoryName = t.PerformingLab), t.TestCode, 
1, 1, 0,'Stored Procedure', GETDATE()
from [tblComepndiumBloodPanelMappingImport] t
--where (Select Count(*)
--       from [tblCompendiumPanelAssignments] tc
--	   Inner join tblCompendiumPanels tcp on tcp.PanelName = tc.PanelDisplayName
--	   where tc.PanelDisplayName = t.PanelName
--	   and tc.ChildPanelID = tcp.ID
--	   and tc.ReferenceLabID = (Select tl.LabId from [tblLabs] tl where tl.LaboratoryName = t.PerformingLab)
--	   and tc.PanelTypeId = 1
--	   and tc.IsActive = 1
--       ) = 0


Insert Into [dbo].[tblCompendiumTests] (TestName, Department, ReqTypeID, isActive, IsDeleted, CreatedBy, CreatedDate)

Select distinct t.ChildTestName, 6, 1, 1, 0, 'Stored Procedure', GETDATE() 
from [dbo].[tblCompendiumBloodGroupTestAssignmentImport] t
where (Select Count(*)
       from [tblCompendiumTests] tct 
	   where tct.TestName = t.ChildTestName
	   and tct.isActive = 1
	   and tct.ReqTypeID = 1
       ) = 0

	   
Update t
set t.TMITCode = [dbo].[Fn_GenerateTmitTestCodeByTestId](ID)
---Select [dbo].[Fn_GenerateTmitTestCodeByTestId](ID), *
from [tblCompendiumTests] t
where ISNULL(TMITCode, '') = ''



Insert Into tblCompendiumTestConfigurations (TestID, GroupTestID, TestDisplayName, TestCode, OrderCode, ReqTypeID, Department, Unit, SpecimenTypeID, ResultType, InstrumentName,
InstrumentResultingMethod, OrderMethodType, OrderMethodName, isActive, IsDeleted, CreatedBy, CreatedDate )

Select distinct (Select tct.ID from [tblCompendiumTests] tct where tct.TestName = t.ChildTestName and tct.ReqTypeID = 1 and tct.isActive = 1),
(Select tct.ID from tblCompendiumPanels tct where tct.PanelName = t.TestName and tct.isActive = 1 and tct.ReqTypeID = 1),
t.TestName, t.ChildTestCode, t.ChildTestCode, 1, 6, t.Unit, (Select tst.SpecimenTypeID from tblSpecimenType tst where tst.SpecimenType = t.SpecimentType),
t.ResultMethod, t.ResultMethodOption, t.ResultMethod, t.OrderMethod, t.OrderMethodOption, 1, 0, 'Stored Procedure', GETDATE()
from [tblCompendiumBloodGroupTestAssignmentImport] t
where (Select Count(*)
       from tblCompendiumTestConfigurations tconfig
	   where tconfig.TestDisplayName = t.ChildTestName
	   and tconfig.isActive = 1
	   and tconfig.GroupTestID = (Select tct.ID from tblCompendiumTests tct where tct.TestName = t.TestName and tct.isActive = 1 and tct.ReqTypeID = 1)
	   and tconfig.ReqTypeID = 1
	   and tconfig.ReferenceLabID = (Select tl.LabId from [tblLabs] tl where tl.LaboratoryName = t.PerformingLab)
	   and tconfig.SpecimenTypeID = (Select tst.SpecimenTypeID from tblSpecimenType tst where tst.SpecimenType = t.SpecimentType)
       ) = 0



Insert Into [tblCompendiumPanelTestAssignments] (PanelID, TestConfigID, TestID, IsActive, IsDeleted, CreatedBy, CreatedDate)

Select distinct (Select tcp.ID from tblCompendiumPanels tcp where tcp.PanelName = t.PanelName and tcp.isActive = 1 and tcp.ReqTypeID = 1 ),
(Select tconfig.ID from tblCompendiumTestConfigurations tconfig where tconfig.TestDisplayName = t.TestName and tconfig.isActive = 1 and tconfig.GroupTestID = (Select tct.ID from tblCompendiumTests tct where tct.TestName = t.TestName and tct.isActive = 1 and tct.ReqTypeID = 1) and tconfig.ReferenceLabID = (Select tl.LabId from [tblLabs] tl where tl.LaboratoryName = t.PerformingLab) and tconfig.SpecimenTypeID = (Select tst.SpecimenTypeID from tblSpecimenType tst where tst.SpecimenType = t.SpecimentType) ),
(Select tct.ID from tblCompendiumTests tct where tct.TestName = t.TestName and tct.isActive = 1 and tct.ReqTypeID = 1), 1, 0, 'Stored Procedure', GETDATE()
from [tblComepndiumBloodPanelMappingImport] t
where t.TestType = 'Individual' 




Insert Into tblCompendiumReportingRules (Name, RuleType, Gender, AgeFrom, AgeTo, MinLow, MaxLow, LowFlag, InterOrMatchingFlag,-- HighLow,
 MaxHigh, HighOrNonMatchingFlag, isActive, IsDeleted, CreatedBy, CreatedDate, ReqTypeId )

Select distinct t.TestName + ' Rule', t.ReferenceValueType, t.Sex, Cast( t.MinAge as int), Cast(t.MaxAge as int), Cast( t.Low as float),Cast( t.High as float), 
t.LowFlag, t.InRangeFlag, Cast(Case when t.CriticalValueLow = 'Null' then Null Else t.CriticalValueLow End as float),
Cast(Case when ISNUMERIC( t.CriticalValueHigh) = 0 then  Null Else t.CriticalValueHigh End as float), t.HighFlag,
1, 0, 'Stored Procedure', GETDATE(), 1
from [tblCompendiumBloodTestRangesImport] t
where (Select Count(*)
       from tblCompendiumReportingRules tr 
	   where tr.Name  = t.TestName + ' Rule'
       ) = 0


Insert Into tblCompenduimTestReportingRules (TestConfigID, ReportingRuleID, isActive, IsDeleted, CreatedBy, CreatedDate)
Select distinct (Select tcg.ID from tblCompendiumTestConfigurations tcg where tcg.TestDisplayName = tr.TestName and tcg.isActive = 1 and tcg.ReqTypeID = 1),
(Select tcrr.ID from tblCompendiumReportingRules tcrr where tcrr.AgeFrom = tr.MinAge and tcrr.AgeTo = tr.MaxAge and tcrr.Name = tr.TestName + ' Rule' and tcrr.Gender = tr.Sex), 1,
0, 'Stored Procedure', GETDATE()
from [tblCompendiumBloodTestRangesImport] tr

End


--Select * from [dbo].[tblCompendiumGroups]
--Select * from [dbo].[tblCompendiumPanels]
--Select * from [dbo].[tblCompendiumGroupPanelsAssignment]
--Select * from [dbo].[tblCompendiumPanelAssignments]
--Select * from [dbo].[tblCompendiumTests]
--Select * from [dbo].[tblCompendiumPanelTestAssignments]
--Select * from tblCompendiumTestConfigurations
--Select * from tblCompendiumPanelType
----Select * from [dbo].[tblCompendiumDependencyAndReflexTests]
--Select * from tblCompendiumReportingRules
--Select * from tblCompenduimTestReportingRules
--Select * from tblCompendiumTestCalculations
--Select * from tblSpecimenType

--Select * from tblDepartment