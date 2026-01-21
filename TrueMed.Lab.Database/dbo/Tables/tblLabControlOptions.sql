CREATE TABLE [dbo].[tblLabControlOptions] (
    [ID]                INT            IDENTITY (1, 1) NOT NULL,
    [LabID]             INT            NULL,
    [OptionID]          INT            NOT NULL,
    [ControlID]         INT            NOT NULL,
    [OptionName]        NVARCHAR (MAX) NULL,
    [OptionValue]       NVARCHAR (MAX) NULL,
    [IsVisible]         BIT            CONSTRAINT [DF_tbllabControlOptions_IsVisible] DEFAULT ((1)) NOT NULL,
    [CreatedBy]         NVARCHAR (MAX) NOT NULL,
    [CreatedDate]       DATETIME2 (7)  NOT NULL,
    [SortOrder]         INT            NULL,
    [isDefaultSelected] BIT            CONSTRAINT [DF_tbllabControlOptions_isDefaultSelected] DEFAULT ((0)) NOT NULL,
    CONSTRAINT [PK_tblLabControlOptions] PRIMARY KEY CLUSTERED ([ID] ASC)
);

