CREATE TABLE [dbo].[tblFacilityOption] (
    [Id]          INT        IDENTITY (1, 1) NOT NULL,
    [OptionId]    INT        NULL,
    [FacilityId]  INT        NOT NULL,
    [OptionValue] NCHAR (10) NULL,
    CONSTRAINT [PK_tblFacilityOption] PRIMARY KEY CLUSTERED ([Id] ASC),
    CONSTRAINT [FK_tblFacilityOption_tblFacility] FOREIGN KEY ([FacilityId]) REFERENCES [dbo].[tblFacility] ([FacilityId])
);


GO
EXECUTE sp_addextendedproperty @name = N'MS_Description', @value = N'Auto Generatd ID/Number', @level0type = N'SCHEMA', @level0name = N'dbo', @level1type = N'TABLE', @level1name = N'tblFacilityOption', @level2type = N'COLUMN', @level2name = N'Id';


GO
EXECUTE sp_addextendedproperty @name = N'MS_Description', @value = N'Option ID / Feature ID linked with Facility', @level0type = N'SCHEMA', @level0name = N'dbo', @level1type = N'TABLE', @level1name = N'tblFacilityOption', @level2type = N'COLUMN', @level2name = N'OptionId';


GO
EXECUTE sp_addextendedproperty @name = N'MS_Description', @value = N'Facility ID', @level0type = N'SCHEMA', @level0name = N'dbo', @level1type = N'TABLE', @level1name = N'tblFacilityOption', @level2type = N'COLUMN', @level2name = N'FacilityId';


GO
EXECUTE sp_addextendedproperty @name = N'MS_Description', @value = N'Option Value (Checked / Unchecked) ', @level0type = N'SCHEMA', @level0name = N'dbo', @level1type = N'TABLE', @level1name = N'tblFacilityOption', @level2type = N'COLUMN', @level2name = N'OptionValue';

