CREATE TABLE [dbo].[tblFacilityRefLabAssignment] (
    [ID]              INT            IDENTITY (1, 1) NOT NULL,
    [FacilityID]      INT            NOT NULL,
    [LabAssignmentID] INT            NULL,
    [CreatedBy]       NVARCHAR (200) NOT NULL,
    [CreatedDate]     DATETIME2 (7)  NOT NULL,
    [UpdatedBy]       NVARCHAR (200) NULL,
    [UpdatedDate]     DATETIME2 (7)  NULL,
    [DeletedBy]       NVARCHAR (200) NULL,
    [DeletedDate]     DATETIME2 (7)  NULL,
    [IsActive]        BIT            CONSTRAINT [DF_tblFacilityRefLabAssignment_IsActive] DEFAULT ((1)) NULL,
    [IsDeleted]       BIT            CONSTRAINT [DF_tblFacilityRefLabAssignment_IsDeleted] DEFAULT ((0)) NULL,
    [IsDefault]       BIT            CONSTRAINT [DF_tblFacilityRefLabAssignment_IsDefault] DEFAULT ((0)) NOT NULL,
    CONSTRAINT [PK_tblFacilityRefLabAssignment] PRIMARY KEY CLUSTERED ([ID] ASC),
    CONSTRAINT [FK_tblFacilityRefLabAssignment_tblFacility] FOREIGN KEY ([FacilityID]) REFERENCES [dbo].[tblFacility] ([FacilityId]),
    CONSTRAINT [FK_tblFacilityRefLabAssignment_tblLabAssignment] FOREIGN KEY ([LabAssignmentID]) REFERENCES [dbo].[tblLabAssignment] ([ID])
);


GO
EXECUTE sp_addextendedproperty @name = N'MS_Description', @value = N'Facility ID (tblFacility Table)', @level0type = N'SCHEMA', @level0name = N'dbo', @level1type = N'TABLE', @level1name = N'tblFacilityRefLabAssignment', @level2type = N'COLUMN', @level2name = N'FacilityID';


GO
EXECUTE sp_addextendedproperty @name = N'MS_Description', @value = N'Login ID', @level0type = N'SCHEMA', @level0name = N'dbo', @level1type = N'TABLE', @level1name = N'tblFacilityRefLabAssignment', @level2type = N'COLUMN', @level2name = N'CreatedBy';


GO
EXECUTE sp_addextendedproperty @name = N'MS_Description', @value = N'Current Created Date and Time', @level0type = N'SCHEMA', @level0name = N'dbo', @level1type = N'TABLE', @level1name = N'tblFacilityRefLabAssignment', @level2type = N'COLUMN', @level2name = N'CreatedDate';


GO
EXECUTE sp_addextendedproperty @name = N'MS_Description', @value = N'Login ID', @level0type = N'SCHEMA', @level0name = N'dbo', @level1type = N'TABLE', @level1name = N'tblFacilityRefLabAssignment', @level2type = N'COLUMN', @level2name = N'UpdatedBy';


GO
EXECUTE sp_addextendedproperty @name = N'MS_Description', @value = N'Current Modify Date and Time', @level0type = N'SCHEMA', @level0name = N'dbo', @level1type = N'TABLE', @level1name = N'tblFacilityRefLabAssignment', @level2type = N'COLUMN', @level2name = N'UpdatedDate';


GO
EXECUTE sp_addextendedproperty @name = N'MS_Description', @value = N'Login ID', @level0type = N'SCHEMA', @level0name = N'dbo', @level1type = N'TABLE', @level1name = N'tblFacilityRefLabAssignment', @level2type = N'COLUMN', @level2name = N'DeletedBy';


GO
EXECUTE sp_addextendedproperty @name = N'MS_Description', @value = N'Current Date and Time', @level0type = N'SCHEMA', @level0name = N'dbo', @level1type = N'TABLE', @level1name = N'tblFacilityRefLabAssignment', @level2type = N'COLUMN', @level2name = N'DeletedDate';


GO
EXECUTE sp_addextendedproperty @name = N'MS_Description', @value = N'Status (Active, Inactive)', @level0type = N'SCHEMA', @level0name = N'dbo', @level1type = N'TABLE', @level1name = N'tblFacilityRefLabAssignment', @level2type = N'COLUMN', @level2name = N'IsActive';

