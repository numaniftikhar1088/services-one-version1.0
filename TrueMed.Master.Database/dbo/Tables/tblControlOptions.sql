CREATE TABLE [dbo].[tblControlOptions] (
    [OptionID]          INT            IDENTITY (1, 1) NOT NULL,
    [ControlID]         INT            NOT NULL,
    [OptionName]        NVARCHAR (MAX) NULL,
    [OptionValue]       NVARCHAR (MAX) NULL,
    [IsVisible]         BIT            CONSTRAINT [DF_tblControlOptions_IsVisible] DEFAULT ((1)) NOT NULL,
    [CreatedBy]         NVARCHAR (MAX) NOT NULL,
    [CreatedDate]       DATETIME2 (7)  NOT NULL,
    [SortOrder]         INT            NULL,
    [isDefaultSelected] BIT            CONSTRAINT [DF_tblControlOptions_isDefaultSelected] DEFAULT ((0)) NOT NULL,
    CONSTRAINT [PK_tblControlOptions_1] PRIMARY KEY CLUSTERED ([OptionID] ASC)
);

