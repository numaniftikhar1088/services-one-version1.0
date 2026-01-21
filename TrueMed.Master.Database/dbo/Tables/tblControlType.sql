CREATE TABLE [dbo].[tblControlType] (
    [ControlID]   INT            NOT NULL,
    [ControlName] NVARCHAR (MAX) NOT NULL,
    [IsVisible]   BIT            CONSTRAINT [DF_tblControlType_IsVisible] DEFAULT ((1)) NOT NULL,
    CONSTRAINT [PK_tblControlType] PRIMARY KEY CLUSTERED ([ControlID] ASC)
);

