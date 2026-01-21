CREATE TABLE [dbo].[tblFacilityCheckBoxOptions] (
    [Key]          INT            IDENTITY (1, 1) NOT NULL,
    [Value]        NVARCHAR (MAX) NULL,
    [DisplayOrder] INT            NULL,
    CONSTRAINT [PK_tblFacilityCheckBoxOptions] PRIMARY KEY CLUSTERED ([Key] ASC)
);

