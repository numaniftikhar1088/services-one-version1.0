CREATE TABLE [dbo].[tblTempReportingRulesUpload] (
    [ID]              INT            IDENTITY (1, 1) NOT NULL,
    [TestCode]        NVARCHAR (MAX) NULL,
    [AgeFrom]         INT            CONSTRAINT [DF_tblTempReportingRulesUpload_AgeFrom] DEFAULT ((1)) NOT NULL,
    [AgeTo]           INT            CONSTRAINT [DF_tblTempReportingRulesUpload_AgeTo] DEFAULT ((999)) NOT NULL,
    [MaxLow]          DECIMAL (18)   NULL,
    [MinLow]          DECIMAL (18)   NULL,
    [MaxMedium]       DECIMAL (18)   NULL,
    [MinMedium]       DECIMAL (18)   NULL,
    [MaxHigh]         DECIMAL (18)   NULL,
    [MinHigh]         DECIMAL (18)   NULL,
    [MaxCrticalHigh]  DECIMAL (18)   NULL,
    [MinCriticalHigh] DECIMAL (18)   NULL,
    [AmpScore]        INT            NULL,
    [CqConf]          INT            NULL,
    [CreatedBy]       NVARCHAR (MAX) NOT NULL,
    [CreatedDate]     DATETIME2 (7)  NULL,
    [UploadStatus]    NVARCHAR (MAX) NOT NULL,
    CONSTRAINT [PK_tblTempReportingRulesUpload] PRIMARY KEY CLUSTERED ([ID] ASC)
);

