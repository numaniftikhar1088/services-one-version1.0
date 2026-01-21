CREATE TABLE [dbo].[tblLabConfiguration] (
    [Id]               INT            IDENTITY (1, 1) NOT NULL,
    [PageId]           INT            NULL,
    [SectionId]        INT            NULL,
    [LabId]            INT            NULL,
    [ControlId]        INT            NULL,
    [IsSelected]       BIT            NULL,
    [DisplayFieldName] NVARCHAR (250) NULL,
    [Required]         BIT            NULL,
    [Visible]          BIT            NULL,
    [CssStyle]         NVARCHAR (50)  NULL,
    [DisplayType]      NVARCHAR (250) NULL,
    PRIMARY KEY CLUSTERED ([Id] ASC)
);

