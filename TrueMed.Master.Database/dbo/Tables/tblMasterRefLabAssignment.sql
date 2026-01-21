CREATE TABLE [dbo].[tblMasterRefLabAssignment] (
    [RefLab_AssignmentID] INT NOT NULL,
    [MasterLabID]         INT NULL,
    [RefLabID]            INT NULL,
    [Status]              BIT NULL,
    CONSTRAINT [PK_tblMasterRefLabAssignment] PRIMARY KEY CLUSTERED ([RefLab_AssignmentID] ASC)
);


GO
EXECUTE sp_addextendedproperty @name = N'MS_Description', @value = N'Auto Generated ID/Number', @level0type = N'SCHEMA', @level0name = N'dbo', @level1type = N'TABLE', @level1name = N'tblMasterRefLabAssignment', @level2type = N'COLUMN', @level2name = N'RefLab_AssignmentID';


GO
EXECUTE sp_addextendedproperty @name = N'MS_Description', @value = N'Master / Parent Lab ID', @level0type = N'SCHEMA', @level0name = N'dbo', @level1type = N'TABLE', @level1name = N'tblMasterRefLabAssignment', @level2type = N'COLUMN', @level2name = N'MasterLabID';


GO
EXECUTE sp_addextendedproperty @name = N'MS_Description', @value = N'Reference Lab ID', @level0type = N'SCHEMA', @level0name = N'dbo', @level1type = N'TABLE', @level1name = N'tblMasterRefLabAssignment', @level2type = N'COLUMN', @level2name = N'RefLabID';


GO
EXECUTE sp_addextendedproperty @name = N'MS_Description', @value = N'Status (Active, Inactive)', @level0type = N'SCHEMA', @level0name = N'dbo', @level1type = N'TABLE', @level1name = N'tblMasterRefLabAssignment', @level2type = N'COLUMN', @level2name = N'Status';

