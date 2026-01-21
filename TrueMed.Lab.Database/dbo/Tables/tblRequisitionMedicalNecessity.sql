CREATE TABLE [dbo].[tblRequisitionMedicalNecessity] (
    [ReqMedNecessityID]   INT            IDENTITY (1, 1) NOT NULL,
    [RequisitionGroupID]  INT            NOT NULL,
    [RequisitionID]       INT            NOT NULL,
    [ReqTypeID]           INT            NULL,
    [ExposuretoCovid19]   BIT            CONSTRAINT [DF_tblRequisitionMedicalNecessity_ExposuretoCovid19] DEFAULT ((0)) NOT NULL,
    [NumberofDayCovid]    INT            NULL,
    [SignandSymptom]      BIT            CONSTRAINT [DF_tblRequisitionMedicalNecessity_SignandSymptom] DEFAULT ((0)) NOT NULL,
    [NumberofDaysSymptom] INT            NULL,
    [RecommendedTest]     BIT            CONSTRAINT [DF_tblRequisitionMedicalNecessity_RecommendedTest] DEFAULT ((0)) NOT NULL,
    [Others]              NVARCHAR (MAX) NULL,
    CONSTRAINT [PK_tblRequisitionMedicalNecessity] PRIMARY KEY CLUSTERED ([ReqMedNecessityID] ASC)
);

