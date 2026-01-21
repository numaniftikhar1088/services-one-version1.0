CREATE TABLE [dbo].[tblSections] (
    [ID]           INT            IDENTITY (1, 1) NOT NULL,
    [SectionName]  NVARCHAR (MAX) NULL,
    [SectionColor] NVARCHAR (MAX) NULL,
    [ParentID]     INT            NULL,
    [CreatedBy]    NVARCHAR (MAX) NULL,
    [CreatedDate]  DATETIME2 (7)  NULL,
    [UpdatedBy]    NVARCHAR (MAX) NULL,
    [UpdatedDate]  DATETIME2 (7)  NULL,
    [Order]        INT            NULL,
    [CssStyle]     NVARCHAR (MAX) NULL,
    [DisplayType]  NVARCHAR (MAX) NULL,
    CONSTRAINT [PK_tblSections] PRIMARY KEY CLUSTERED ([ID] ASC)
);

