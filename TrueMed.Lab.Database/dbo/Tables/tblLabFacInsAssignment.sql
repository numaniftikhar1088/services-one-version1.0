CREATE TABLE [dbo].[tblLabFacInsAssignment] (
    [ID]                INT            IDENTITY (1, 1) NOT NULL,
    [LabID]             INT            NOT NULL,
    [LabType]           NVARCHAR (50)  NULL,
    [FacilityID]        INT            NOT NULL,
    [ReqTypeID]         INT            NULL,
    [GroupID]           INT            NULL,
    [InsuranceID]       INT            NULL,
    [InsuranceOptionID] INT            NULL,
    [Gender]            NVARCHAR (MAX) NULL,
    [CreatedBy]         NVARCHAR (200) NOT NULL,
    [CreatedDate]       DATETIME2 (7)  NOT NULL,
    [UpdatedBy]         NVARCHAR (200) NULL,
    [UpdatedDate]       DATETIME2 (7)  NULL,
    [DeletedBy]         NVARCHAR (200) NULL,
    [DeletedDate]       DATETIME2 (7)  NULL,
    [Status]            BIT            CONSTRAINT [DF__tblLabFac__Statu__2AD55B43] DEFAULT ((1)) NOT NULL,
    [IsDeleted]         BIT            CONSTRAINT [DF_tblLabFacInsAssignment_IsDeleted] DEFAULT ((0)) NULL,
    [IsDefault]         BIT            CONSTRAINT [DF_tblLabFacInsAssignment_IsDefault] DEFAULT ((0)) NULL,
    CONSTRAINT [PK_tblLabFacInsAssignment] PRIMARY KEY CLUSTERED ([ID] ASC),
    CONSTRAINT [FK_tblLabFacInsAssignment_tblFacility] FOREIGN KEY ([FacilityID]) REFERENCES [dbo].[tblFacility] ([FacilityId])
);


GO
EXECUTE sp_addextendedproperty @name = N'MS_Description', @value = N'Auto Generated ID', @level0type = N'SCHEMA', @level0name = N'dbo', @level1type = N'TABLE', @level1name = N'tblLabFacInsAssignment', @level2type = N'COLUMN', @level2name = N'ID';


GO
EXECUTE sp_addextendedproperty @name = N'MS_Description', @value = N'Reference Lab (tblLabs Table) - Inhouse or Reference', @level0type = N'SCHEMA', @level0name = N'dbo', @level1type = N'TABLE', @level1name = N'tblLabFacInsAssignment', @level2type = N'COLUMN', @level2name = N'LabID';


GO
EXECUTE sp_addextendedproperty @name = N'MS_Description', @value = N'Lab Type (Inhouse, Reference)', @level0type = N'SCHEMA', @level0name = N'dbo', @level1type = N'TABLE', @level1name = N'tblLabFacInsAssignment', @level2type = N'COLUMN', @level2name = N'LabType';


GO
EXECUTE sp_addextendedproperty @name = N'MS_Description', @value = N'Facility ID (tblFacility Table)', @level0type = N'SCHEMA', @level0name = N'dbo', @level1type = N'TABLE', @level1name = N'tblLabFacInsAssignment', @level2type = N'COLUMN', @level2name = N'FacilityID';


GO
EXECUTE sp_addextendedproperty @name = N'MS_Description', @value = N'Requisition Type ID (tblRequisitionType Table)', @level0type = N'SCHEMA', @level0name = N'dbo', @level1type = N'TABLE', @level1name = N'tblLabFacInsAssignment', @level2type = N'COLUMN', @level2name = N'ReqTypeID';


GO
EXECUTE sp_addextendedproperty @name = N'MS_Description', @value = N'Group ID (tblGroupSetup Table)', @level0type = N'SCHEMA', @level0name = N'dbo', @level1type = N'TABLE', @level1name = N'tblLabFacInsAssignment', @level2type = N'COLUMN', @level2name = N'GroupID';


GO
EXECUTE sp_addextendedproperty @name = N'MS_Description', @value = N'Insurance ID (tblInsuranceSetup Table)', @level0type = N'SCHEMA', @level0name = N'dbo', @level1type = N'TABLE', @level1name = N'tblLabFacInsAssignment', @level2type = N'COLUMN', @level2name = N'InsuranceID';


GO
EXECUTE sp_addextendedproperty @name = N'MS_Description', @value = N'Gender (Male, Female, Unknown, Intersex)', @level0type = N'SCHEMA', @level0name = N'dbo', @level1type = N'TABLE', @level1name = N'tblLabFacInsAssignment', @level2type = N'COLUMN', @level2name = N'Gender';


GO
EXECUTE sp_addextendedproperty @name = N'MS_Description', @value = N'Login ID', @level0type = N'SCHEMA', @level0name = N'dbo', @level1type = N'TABLE', @level1name = N'tblLabFacInsAssignment', @level2type = N'COLUMN', @level2name = N'CreatedBy';


GO
EXECUTE sp_addextendedproperty @name = N'MS_Description', @value = N'Current Created Date and Time', @level0type = N'SCHEMA', @level0name = N'dbo', @level1type = N'TABLE', @level1name = N'tblLabFacInsAssignment', @level2type = N'COLUMN', @level2name = N'CreatedDate';


GO
EXECUTE sp_addextendedproperty @name = N'MS_Description', @value = N'Login ID', @level0type = N'SCHEMA', @level0name = N'dbo', @level1type = N'TABLE', @level1name = N'tblLabFacInsAssignment', @level2type = N'COLUMN', @level2name = N'UpdatedBy';


GO
EXECUTE sp_addextendedproperty @name = N'MS_Description', @value = N'Current Modify Date and Time', @level0type = N'SCHEMA', @level0name = N'dbo', @level1type = N'TABLE', @level1name = N'tblLabFacInsAssignment', @level2type = N'COLUMN', @level2name = N'UpdatedDate';


GO
EXECUTE sp_addextendedproperty @name = N'MS_Description', @value = N'Login ID', @level0type = N'SCHEMA', @level0name = N'dbo', @level1type = N'TABLE', @level1name = N'tblLabFacInsAssignment', @level2type = N'COLUMN', @level2name = N'DeletedBy';


GO
EXECUTE sp_addextendedproperty @name = N'MS_Description', @value = N'Current Date and Time', @level0type = N'SCHEMA', @level0name = N'dbo', @level1type = N'TABLE', @level1name = N'tblLabFacInsAssignment', @level2type = N'COLUMN', @level2name = N'DeletedDate';


GO
EXECUTE sp_addextendedproperty @name = N'MS_Description', @value = N'Status (Active, Inactive)', @level0type = N'SCHEMA', @level0name = N'dbo', @level1type = N'TABLE', @level1name = N'tblLabFacInsAssignment', @level2type = N'COLUMN', @level2name = N'Status';

