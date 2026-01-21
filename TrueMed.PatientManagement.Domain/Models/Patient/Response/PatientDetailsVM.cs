using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TrueMed.PatientManagement.Domain.Models.Patient.Response
{
    public class PatientDetailsVM
    {
        public Patient? Patient { get; set; }
        public Address? Address { get; set; }
        public Insurance? Insurance { get; set; }
    }

    public class Patient
    {
        public string? FirstName { get; set; } 
        public string? MiddleName { get; set; }
        public string? LastName { get; set; }
        public string? DateOfBirth { get; set; }
        public string? DLIDNumber { get; set; }
        public string? Ethinicity { get; set; }
        public string? Gender { get; set; }
        public int PatientId { get; set; }
        public string? PassPortNumber { get; set; }
        public string? Email { get; set; }
        public int? FacilityId { get; set; }
        public string? Height { get; set; }
        public string? LandPhone { get; set; }
        public string? Mobile { get; set; }
        public string? Weight { get; set; }
        public string? FacilityName { get; set; }
        public string? PatientType { get; set; }
        public string? Race { get; set; }
        public string? SocialSecurityNumber { get; set; }
    }
    public class Address
    {
        public int? PatientAddInfoId { get; set; }
        public string? Address1 { get; set; }
        public string? Address2 { get; set; }
        public string? City { get; set; }
        public string? Country { get; set; }
        public string? State { get; set; }
        public string? ZipCode { get; set; }
        public string? County { get; set; }

    }
    public class Insurance
    {
        public string? SubscriberFName { get; set; }
        public string? SubscriberLName { get; set; }
        public string? SubscriberDOB { get; set; }
        public string? SubscriberRelation { get; set; }
        public string? SubscriberPolicyId { get; set; }
        public string? SubscriberGroupNumber { get; set; }
    }
}
