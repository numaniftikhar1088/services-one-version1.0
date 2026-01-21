CREATE TABLE [dbo].[tblDepartment] (
    [DeptID]         INT            IDENTITY (1, 1) NOT NULL,
    [DepartmentName] NVARCHAR (MAX) NOT NULL,
    [CreatedBy]      NVARCHAR (200) NOT NULL,
    [CreatedDate]    DATETIME2 (7)  NOT NULL,
    [UpdatedBy]      NVARCHAR (200) NULL,
    [UpdatedDate]    DATETIME2 (7)  NULL,
    [DeletedBy]      NVARCHAR (200) NULL,
    [DeletedDate]    DATETIME2 (7)  NULL,
    [IsDeleted]      BIT            NOT NULL,
    [DeptStatus]     BIT            NULL,
    CONSTRAINT [PK_tblDepartment] PRIMARY KEY CLUSTERED ([DeptID] ASC)
);

