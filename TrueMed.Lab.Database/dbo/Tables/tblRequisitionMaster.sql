CREATE TABLE [dbo].[tblRequisitionMaster] (
    [RequisitionID]            INT            IDENTITY (1, 1) NOT NULL,
    [OrderNumber]              NVARCHAR (50)  NULL,
    [FacilityID]               INT            NOT NULL,
    [PatientID]                INT            NULL,
    [FirstName]                NVARCHAR (MAX) NULL,
    [LastName]                 NVARCHAR (MAX) NULL,
    [DOB]                      DATETIME2 (7)  NULL,
    [Gender]                   NCHAR (10)     NULL,
    [Address1]                 NVARCHAR (MAX) NULL,
    [Address2]                 NVARCHAR (MAX) NULL,
    [City]                     NVARCHAR (MAX) NULL,
    [State]                    NVARCHAR (50)  NULL,
    [Country]                  NVARCHAR (50)  NULL,
    [ZipCode]                  NVARCHAR (50)  NULL,
    [County]                   NVARCHAR (50)  NULL,
    [Phone]                    NVARCHAR (50)  NULL,
    [Mobile]                   NVARCHAR (50)  NULL,
    [Email]                    NVARCHAR (MAX) NULL,
    [Race]                     NVARCHAR (MAX) NULL,
    [Ethnicity]                NVARCHAR (MAX) NULL,
    [SocialSecurityNumber]     NVARCHAR (MAX) NULL,
    [PatientDrivingORIDNumber] NVARCHAR (MAX) NULL,
    [PassPortNumber]           NVARCHAR (MAX) NULL,
    [PatientType]              NVARCHAR (MAX) NULL,
    [Height]                   NVARCHAR (MAX) NULL,
    [Weight]                   NVARCHAR (30)  NULL,
    [PhysicianID]              NVARCHAR (MAX) NULL,
    [CollectorID]              NVARCHAR (MAX) NULL,
    [DateofCollection]         DATETIME2 (7)  NULL,
    [CollectedBy]              NVARCHAR (30)  NULL,
    [TimeofCollection]         TIME (7)       NULL,
    [RequisitionStatus]        INT            NULL,
    [MissingColumns]           NVARCHAR (MAX) NULL,
    [OrderType]                NVARCHAR (30)  NULL,
    [StatOrder]                NVARCHAR (10)  NULL,
    [Mileage]                  NVARCHAR (300) NULL,
    [PhysicianSignature]       NVARCHAR (MAX) NULL,
    [PatientSignature]         NVARCHAR (MAX) NULL,
    [CreatedBy]                NVARCHAR (200) NULL,
    [CreatedDate]              DATETIME2 (7)  NULL,
    [UpdatedBy]                NVARCHAR (200) NULL,
    [UpdatedDate]              DATETIME2 (7)  NULL,
    [DeletedBy]                NVARCHAR (200) NULL,
    [DeletedDate]              DATETIME2 (7)  NULL,
    [IsDeleted]                BIT            CONSTRAINT [DF_tblRequisitionMaster_IsDeleted] DEFAULT ((0)) NULL,
    [DateReceived]             DATETIME       NULL,
    CONSTRAINT [PK_tblRequisitionMaster] PRIMARY KEY CLUSTERED ([RequisitionID] ASC)
);


GO
EXECUTE sp_addextendedproperty @name = N'MS_Description', @value = N'Auto Generated ID/Number', @level0type = N'SCHEMA', @level0name = N'dbo', @level1type = N'TABLE', @level1name = N'tblRequisitionMaster', @level2type = N'COLUMN', @level2name = N'RequisitionID';


GO
EXECUTE sp_addextendedproperty @name = N'MS_Description', @value = N'Order Number', @level0type = N'SCHEMA', @level0name = N'dbo', @level1type = N'TABLE', @level1name = N'tblRequisitionMaster', @level2type = N'COLUMN', @level2name = N'OrderNumber';


GO
EXECUTE sp_addextendedproperty @name = N'MS_Description', @value = N'Facility ID (tblLabFacilityAssignment Table)', @level0type = N'SCHEMA', @level0name = N'dbo', @level1type = N'TABLE', @level1name = N'tblRequisitionMaster', @level2type = N'COLUMN', @level2name = N'FacilityID';


GO
EXECUTE sp_addextendedproperty @name = N'MS_Description', @value = N'Patient ID (tblPatientBasicInfo & tblPatientAddInfo Table)', @level0type = N'SCHEMA', @level0name = N'dbo', @level1type = N'TABLE', @level1name = N'tblRequisitionMaster', @level2type = N'COLUMN', @level2name = N'PatientID';


GO
EXECUTE sp_addextendedproperty @name = N'MS_Description', @value = N'Patient Present Address', @level0type = N'SCHEMA', @level0name = N'dbo', @level1type = N'TABLE', @level1name = N'tblRequisitionMaster', @level2type = N'COLUMN', @level2name = N'Address1';


GO
EXECUTE sp_addextendedproperty @name = N'MS_Description', @value = N'Patient Present Address', @level0type = N'SCHEMA', @level0name = N'dbo', @level1type = N'TABLE', @level1name = N'tblRequisitionMaster', @level2type = N'COLUMN', @level2name = N'Address2';


GO
EXECUTE sp_addextendedproperty @name = N'MS_Description', @value = N'City ID', @level0type = N'SCHEMA', @level0name = N'dbo', @level1type = N'TABLE', @level1name = N'tblRequisitionMaster', @level2type = N'COLUMN', @level2name = N'City';


GO
EXECUTE sp_addextendedproperty @name = N'MS_Description', @value = N'State ID', @level0type = N'SCHEMA', @level0name = N'dbo', @level1type = N'TABLE', @level1name = N'tblRequisitionMaster', @level2type = N'COLUMN', @level2name = N'State';


GO
EXECUTE sp_addextendedproperty @name = N'MS_Description', @value = N'Country ID', @level0type = N'SCHEMA', @level0name = N'dbo', @level1type = N'TABLE', @level1name = N'tblRequisitionMaster', @level2type = N'COLUMN', @level2name = N'Country';


GO
EXECUTE sp_addextendedproperty @name = N'MS_Description', @value = N'Zip Code', @level0type = N'SCHEMA', @level0name = N'dbo', @level1type = N'TABLE', @level1name = N'tblRequisitionMaster', @level2type = N'COLUMN', @level2name = N'ZipCode';


GO
EXECUTE sp_addextendedproperty @name = N'MS_Description', @value = N'County', @level0type = N'SCHEMA', @level0name = N'dbo', @level1type = N'TABLE', @level1name = N'tblRequisitionMaster', @level2type = N'COLUMN', @level2name = N'County';


GO
EXECUTE sp_addextendedproperty @name = N'MS_Description', @value = N'Patient Land Phone Number', @level0type = N'SCHEMA', @level0name = N'dbo', @level1type = N'TABLE', @level1name = N'tblRequisitionMaster', @level2type = N'COLUMN', @level2name = N'Phone';


GO
EXECUTE sp_addextendedproperty @name = N'MS_Description', @value = N'Patient Mobile Number', @level0type = N'SCHEMA', @level0name = N'dbo', @level1type = N'TABLE', @level1name = N'tblRequisitionMaster', @level2type = N'COLUMN', @level2name = N'Mobile';


GO
EXECUTE sp_addextendedproperty @name = N'MS_Description', @value = N'Patient Email Address', @level0type = N'SCHEMA', @level0name = N'dbo', @level1type = N'TABLE', @level1name = N'tblRequisitionMaster', @level2type = N'COLUMN', @level2name = N'Email';


GO
EXECUTE sp_addextendedproperty @name = N'MS_Description', @value = N'Physician ID (tblFacilityUser Table)', @level0type = N'SCHEMA', @level0name = N'dbo', @level1type = N'TABLE', @level1name = N'tblRequisitionMaster', @level2type = N'COLUMN', @level2name = N'PhysicianID';


GO
EXECUTE sp_addextendedproperty @name = N'MS_Description', @value = N'Collector ID (tblFacilityUser Table)', @level0type = N'SCHEMA', @level0name = N'dbo', @level1type = N'TABLE', @level1name = N'tblRequisitionMaster', @level2type = N'COLUMN', @level2name = N'CollectorID';


GO
EXECUTE sp_addextendedproperty @name = N'MS_Description', @value = N'Specimen Collection Date', @level0type = N'SCHEMA', @level0name = N'dbo', @level1type = N'TABLE', @level1name = N'tblRequisitionMaster', @level2type = N'COLUMN', @level2name = N'DateofCollection';


GO
EXECUTE sp_addextendedproperty @name = N'MS_Description', @value = N'Requisition Status Like Open, Pending, Rejected, Close etc.', @level0type = N'SCHEMA', @level0name = N'dbo', @level1type = N'TABLE', @level1name = N'tblRequisitionMaster', @level2type = N'COLUMN', @level2name = N'RequisitionStatus';


GO
EXECUTE sp_addextendedproperty @name = N'MS_Description', @value = N'User Login ID', @level0type = N'SCHEMA', @level0name = N'dbo', @level1type = N'TABLE', @level1name = N'tblRequisitionMaster', @level2type = N'COLUMN', @level2name = N'CreatedBy';


GO
EXECUTE sp_addextendedproperty @name = N'MS_Description', @value = N'Current Created Date and Time', @level0type = N'SCHEMA', @level0name = N'dbo', @level1type = N'TABLE', @level1name = N'tblRequisitionMaster', @level2type = N'COLUMN', @level2name = N'CreatedDate';


GO
EXECUTE sp_addextendedproperty @name = N'MS_Description', @value = N'User Login ID', @level0type = N'SCHEMA', @level0name = N'dbo', @level1type = N'TABLE', @level1name = N'tblRequisitionMaster', @level2type = N'COLUMN', @level2name = N'UpdatedBy';


GO
EXECUTE sp_addextendedproperty @name = N'MS_Description', @value = N'Current Modify Date and Time', @level0type = N'SCHEMA', @level0name = N'dbo', @level1type = N'TABLE', @level1name = N'tblRequisitionMaster', @level2type = N'COLUMN', @level2name = N'UpdatedDate';


GO
EXECUTE sp_addextendedproperty @name = N'MS_Description', @value = N'User Login ID', @level0type = N'SCHEMA', @level0name = N'dbo', @level1type = N'TABLE', @level1name = N'tblRequisitionMaster', @level2type = N'COLUMN', @level2name = N'DeletedBy';


GO
EXECUTE sp_addextendedproperty @name = N'MS_Description', @value = N'Current Deleted Date and Time', @level0type = N'SCHEMA', @level0name = N'dbo', @level1type = N'TABLE', @level1name = N'tblRequisitionMaster', @level2type = N'COLUMN', @level2name = N'DeletedDate';

