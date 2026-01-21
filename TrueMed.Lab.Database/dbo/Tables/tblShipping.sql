CREATE TABLE [dbo].[tblShipping] (
    [Id]              INT            IDENTITY (1, 1) NOT NULL,
    [ShippingName]    NVARCHAR (MAX) NULL,
    [ShippingAddress] NVARCHAR (MAX) NULL,
    [ShippingPhoneNo] NVARCHAR (MAX) NULL,
    [ShippingEmail]   NVARCHAR (MAX) NULL,
    [ShippingNote]    NVARCHAR (MAX) NULL,
    [FacilityId]      INT            NOT NULL,
    CONSTRAINT [PK_tblShipping] PRIMARY KEY CLUSTERED ([Id] ASC),
    CONSTRAINT [FK_tblShipping_tblFacility] FOREIGN KEY ([FacilityId]) REFERENCES [dbo].[tblFacility] ([FacilityId]),
    CONSTRAINT [IX_tblShipping] UNIQUE NONCLUSTERED ([FacilityId] ASC)
);

