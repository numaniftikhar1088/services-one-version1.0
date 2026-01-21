CREATE TABLE [dbo].[tblLabAssignment] (
    [ID]                INT            IDENTITY (1, 1) NOT NULL,
    [ProfileName]       NVARCHAR (MAX) NOT NULL,
    [RefLabID]          INT            NOT NULL,
    [LabType]           INT            NOT NULL,
    [ReqTypeID]         INT            NOT NULL,
    [InsuranceID]       NVARCHAR (MAX) NULL,
    [InsuranceOptionID] NVARCHAR (MAX) NULL,
    [Gender]            NVARCHAR (MAX) NULL,
    [CreatedBy]         NVARCHAR (200) NOT NULL,
    [CreatedDate]       DATETIME2 (7)  NOT NULL,
    [UpdatedBy]         NVARCHAR (200) NULL,
    [UpdatedDate]       DATETIME2 (7)  NULL,
    [DeletedBy]         NVARCHAR (200) NULL,
    [DeletedDate]       DATETIME2 (7)  NULL,
    [IsActive]          BIT            CONSTRAINT [DF_tblLabAssignment_IsActive] DEFAULT ((1)) NOT NULL,
    [IsDeleted]         BIT            CONSTRAINT [DF_tblLabAssignment_IsDeleted] DEFAULT ((0)) NULL,
    [IsDefault]         BIT            CONSTRAINT [DF_tblLabAssignment_IsDefault] DEFAULT ((0)) NOT NULL,
    CONSTRAINT [PK_tblLabAssignment] PRIMARY KEY CLUSTERED ([ID] ASC),
    CONSTRAINT [FK_tblLabAssignment_tblLabRequisitionType] FOREIGN KEY ([ReqTypeID]) REFERENCES [dbo].[tblLabRequisitionType] ([ReqTypeID]),
    CONSTRAINT [FK_tblLabAssignment_tblLabs] FOREIGN KEY ([RefLabID]) REFERENCES [dbo].[tblLabs] ([LabId])
);

