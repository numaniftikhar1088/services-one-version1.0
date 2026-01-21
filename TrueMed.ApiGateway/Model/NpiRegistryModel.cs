using Newtonsoft.Json;
using System.Net;

namespace TrueMed.ApiGateway.Model
{
    public class Addresses
    {
        public string country_code { get; set; }
        public string country_name { get; set; }
        public string address_purpose { get; set; }
        public string address_type { get; set; }
        public string address_1 { get; set; }
        public string city { get; set; }
        public string state { get; set; }
        public string postal_code { get; set; }
        public string telephone_number { get; set; }
        public string fax_number { get; set; }

    }
    public class Basic
    {
        public string first_name { get; set; }
        public string last_name { get; set; }
        public string middle_name { get; set; }
        public string credential { get; set; }
        public string sole_proprietor { get; set; }
        public string gender { get; set; }
        public string enumeration_date { get; set; }
        public string last_updated { get; set; }
        public string status { get; set; }
        public string name_prefix { get; set; }
        public string name_suffix { get; set; }

    }
    public class Taxonomies
    {
        public string code { get; set; }
        public string taxonomy_group { get; set; }
        public string desc { get; set; }
        public string state { get; set; }
        public string license { get; set; }
        public bool primary { get; set; }

    }
    public class Identifiers
    {
        public string code { get; set; }
        public string desc { get; set; }
        public string issuer { get; set; }
        public string identifier { get; set; }
        public string state { get; set; }

    }
    public class Results
    {
        public string created_epoch { get; set; }
        public string enumeration_type { get; set; }
        public string last_updated_epoch { get; set; }
        public string number { get; set; }
        public IList<Addresses> addresses { get; set; }
        public IList<dynamic> practiceLocations { get; set; }
        public Basic basic { get; set; }
        public IList<Taxonomies> taxonomies { get; set; }
        public IList<Identifiers> identifiers { get; set; }
        public IList<dynamic> endpoints { get; set; }
        public IList<dynamic> other_names { get; set; }

    }
    public class NPIRegistry
    {
        public int result_count { get; set; }
        public IList<Results> results { get; set; }

    }
    public class NPIRegistryExposeDataModel
    {
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public string? NPI { get; set; }
    }
}
