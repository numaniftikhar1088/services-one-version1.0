CREATE TABLE [dbo].[tblRequisitionAccessionsNoMore] (
    [RequisitionAccessionID] INT            IDENTITY (1, 1) NOT NULL,
    [RequisitionOrderID]     INT            NULL,
    [RequisitionID]          INT            NULL,
    [SpecimenType]           INT            NULL,
    [AccessionNumber]        NVARCHAR (MAX) NULL,
    [CreatedBy]              NVARCHAR (MAX) NULL,
    [CreatedDate]            DATETIME2 (7)  NULL,
    CONSTRAINT [PK_tblRequistionAccessions] PRIMARY KEY CLUSTERED ([RequisitionAccessionID] ASC)
);

