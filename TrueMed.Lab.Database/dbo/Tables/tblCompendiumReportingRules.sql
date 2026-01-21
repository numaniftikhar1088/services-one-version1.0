CREATE TABLE [dbo].[tblCompendiumReportingRules] (
    [ID]                    INT            IDENTITY (1, 1) NOT NULL,
    [Name]                  NVARCHAR (MAX) NULL,
    [RuleType]              NVARCHAR (MAX) NULL,
    [Gender]                NVARCHAR (MAX) NULL,
    [AgeFrom]               INT            NULL,
    [AgeTo]                 INT            NULL,
    [CuttoffExpression]     NVARCHAR (MAX) NULL,
    [CuttOffValue]          DECIMAL (18)   NULL,
    [Text]                  NVARCHAR (MAX) NULL,
    [MinLowExpression]      NVARCHAR (MAX) NULL,
    [MinLow]                DECIMAL (18)   NULL,
    [MaxLowExpression]      NVARCHAR (MAX) NULL,
    [MaxLow]                DECIMAL (18)   NULL,
    [LowFlag]               NVARCHAR (MAX) NULL,
    [MinInterExpression]    NVARCHAR (MAX) NULL,
    [MinInter]              DECIMAL (18)   NULL,
    [MaxInterExpression]    NVARCHAR (MAX) NULL,
    [MaxInter]              DECIMAL (18)   NULL,
    [InterOrMatchingFlag]   NVARCHAR (MAX) NULL,
    [MinHighExpression]     NVARCHAR (MAX) NULL,
    [MinHigh]               DECIMAL (18)   NULL,
    [MaxHighExpression]     NVARCHAR (MAX) NULL,
    [MaxHigh]               DECIMAL (18)   NULL,
    [MinCriticalHigh]       DECIMAL (18)   NULL,
    [MaxCriticalHigh]       DECIMAL (18)   NULL,
    [HighOrNonMatchingFlag] NVARCHAR (MAX) NULL,
    [SortOrder]             INT            NULL,
    [IsActive]              BIT            CONSTRAINT [DF_tblCompendiumReportingRules_isActive] DEFAULT ((1)) NOT NULL,
    [IsDeleted]             BIT            CONSTRAINT [DF_tblCompendiumReportingRules_IsDeleted] DEFAULT ((0)) NOT NULL,
    [CreatedBy]             NVARCHAR (MAX) NOT NULL,
    [CreatedDate]           DATETIME2 (7)  NOT NULL,
    [UpdatedBy]             NVARCHAR (MAX) NULL,
    [UpdatedDate]           DATETIME2 (7)  NULL,
    [DeletedBy]             NVARCHAR (MAX) NULL,
    [DeletedDate]           DATETIME2 (7)  NULL,
    [ReqTypeId]             INT            NULL,
    [AmpScore]              DECIMAL (18)   NULL,
    [CqConf]                DECIMAL (18)   NULL,
    CONSTRAINT [PK_tblCompendiumReportingRules] PRIMARY KEY CLUSTERED ([ID] ASC)
);


GO
EXECUTE sp_addextendedproperty @name = N'MS_Description', @value = N'Status (Active, Inactive)', @level0type = N'SCHEMA', @level0name = N'dbo', @level1type = N'TABLE', @level1name = N'tblCompendiumReportingRules', @level2type = N'COLUMN', @level2name = N'IsActive';


GO
EXECUTE sp_addextendedproperty @name = N'MS_Description', @value = N'Login ID', @level0type = N'SCHEMA', @level0name = N'dbo', @level1type = N'TABLE', @level1name = N'tblCompendiumReportingRules', @level2type = N'COLUMN', @level2name = N'CreatedBy';


GO
EXECUTE sp_addextendedproperty @name = N'MS_Description', @value = N'Current Created Data and Time of login user time zone', @level0type = N'SCHEMA', @level0name = N'dbo', @level1type = N'TABLE', @level1name = N'tblCompendiumReportingRules', @level2type = N'COLUMN', @level2name = N'CreatedDate';


GO
EXECUTE sp_addextendedproperty @name = N'MS_Description', @value = N'Login ID', @level0type = N'SCHEMA', @level0name = N'dbo', @level1type = N'TABLE', @level1name = N'tblCompendiumReportingRules', @level2type = N'COLUMN', @level2name = N'UpdatedBy';


GO
EXECUTE sp_addextendedproperty @name = N'MS_Description', @value = N'Current Modify Date and Time of login user time zone', @level0type = N'SCHEMA', @level0name = N'dbo', @level1type = N'TABLE', @level1name = N'tblCompendiumReportingRules', @level2type = N'COLUMN', @level2name = N'UpdatedDate';


GO
EXECUTE sp_addextendedproperty @name = N'MS_Description', @value = N'Login ID', @level0type = N'SCHEMA', @level0name = N'dbo', @level1type = N'TABLE', @level1name = N'tblCompendiumReportingRules', @level2type = N'COLUMN', @level2name = N'DeletedBy';


GO
EXECUTE sp_addextendedproperty @name = N'MS_Description', @value = N'Current Delete Date and Time of login user time zone', @level0type = N'SCHEMA', @level0name = N'dbo', @level1type = N'TABLE', @level1name = N'tblCompendiumReportingRules', @level2type = N'COLUMN', @level2name = N'DeletedDate';

