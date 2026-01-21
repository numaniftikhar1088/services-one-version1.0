CREATE TABLE [dbo].[tblRequisitionDrugAllergyCodes] (
    [RequisitionDrugID]        INT            IDENTITY (1, 1) NOT NULL,
    [RequisitionOrderID]       INT            NOT NULL,
    [RequisitionID]            INT            NOT NULL,
    [ReqTypeID]                INT            NULL,
    [DrugCode]                 NVARCHAR (50)  NULL,
    [DrugAllergiesDescription] NVARCHAR (MAX) NULL,
    CONSTRAINT [PK_tblRequisitionDrugAllergyCodes] PRIMARY KEY CLUSTERED ([RequisitionDrugID] ASC)
);

