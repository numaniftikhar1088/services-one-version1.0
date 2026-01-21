CREATE TABLE [dbo].[tblLabPageSection] (
    [ID]                     INT            IDENTITY (1, 1) NOT NULL,
    [LabID]                  INT            NULL,
    [PageId]                 INT            NULL,
    [SectionID]              INT            NULL,
    [SectionName]            NVARCHAR (MAX) NULL,
    [SectionColor]           NVARCHAR (MAX) NULL,
    [SortOrder]              INT            NULL,
    [isSelected]             BIT            NULL,
    [IsReqSection]           INT            NULL,
    [CssStyle]               NVARCHAR (MAX) NULL,
    [DisplayType]            NVARCHAR (MAX) NULL,
    [OrderViewSortOrder]     INT            NULL,
    [OrderViewDisplayType]   NVARCHAR (MAX) NULL,
    [OrderViewMergeSections] NVARCHAR (MAX) NULL,
    [CustomScript]           NVARCHAR (MAX) NULL,
    [CreatedBy]              NVARCHAR (MAX) NULL,
    [CreatedDate]            DATETIME2 (7)  NULL,
    CONSTRAINT [PK_tblLabPageSection] PRIMARY KEY CLUSTERED ([ID] ASC)
);

