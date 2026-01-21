CREATE TABLE [dbo].[tblLabSectionsControls] (
    [ID]          INT            NOT NULL,
    [LabID]       INT            NOT NULL,
    [ControlID]   INT            NOT NULL,
    [DisplayName] NVARCHAR (MAX) NOT NULL,
    [IsRequired]  BIT            CONSTRAINT [DF_tblLabSectionsControls_isRequired] DEFAULT ((1)) NOT NULL,
    [CssClass]    NVARCHAR (MAX) NULL,
    [CreatedBy]   NVARCHAR (MAX) NOT NULL,
    [CreatedDate] DATETIME2 (7)  NOT NULL,
    [UpdateBy]    NVARCHAR (MAX) NULL,
    [UpdatedDate] DATETIME2 (7)  NULL,
    CONSTRAINT [PK_tblLabSectionsControls] PRIMARY KEY CLUSTERED ([ID] ASC)
);

