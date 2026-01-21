CREATE function [dbo].[Fn_GenerateTmitTestCodeByPanelId](@panelId int)
RETURNS VARCHAR(max)
As
Begin
declare @PanelPFix varchar(10), @TypePFix varchar(10)

Select top 1 @TypePFix= LEFT(tr.RequisitionTypeName,1) from [tblCompendiumPanels] t join tblRequisitionType tr on t.ReqTypeID=tr.ReqTypeID  where t.ID = @panelId

	Return 'TMT' + @TypePFix + format(@panelId,'0000')
End