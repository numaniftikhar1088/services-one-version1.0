CREATE function [dbo].[Fn_GenerateTmitTestCodeByTestId](@testId int)
RETURNS VARCHAR(max)
As
Begin
declare @TestPFix varchar(10), @TypePFix varchar(10)

Select top 1 @TypePFix= LEFT(tr.RequisitionTypeName,1) from tblCompendiumTests t join tblRequisitionType tr on t.ReqTypeID=tr.ReqTypeID  where t.ID=@testId

	Return 'TMT' + @TypePFix + format(@testId,'0000')
End